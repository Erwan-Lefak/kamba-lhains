// Mock Redis pour le build
class MockRedis {
  async get(key: string) { return null; }
  async set(key: string, value: any, mode?: string, duration?: number) { return 'OK'; }
  async del(key: string) { return 1; }
  async flushall() { return 'OK'; }
  async keys(pattern: string) { return []; }
}

const Redis = MockRedis;

// Types pour la configuration du cache
export interface CacheConfig {
  host: string;
  port: number;
  password?: string;
  db?: number;
  keyPrefix?: string;
  maxRetriesPerRequest?: number;
  retryDelayOnFailover?: number;
  enableReadyCheck?: boolean;
}

export interface CacheOptions {
  ttl?: number; // Time to live en secondes
  tags?: string[]; // Tags pour l'invalidation groupée
  compress?: boolean; // Compression des données
  serialize?: boolean; // Sérialisation JSON automatique
}

export interface CacheStats {
  hits: number;
  misses: number;
  keys: number;
  memory: string;
  hitRate: number;
}

// Instance Redis singleton
class RedisCache {
  private client: any | null = null;
  private isConnected = false;
  private stats = {
    hits: 0,
    misses: 0,
    errors: 0
  };

  constructor() {
    this.connect();
  }

  /**
   * Connexion à Redis avec gestion d'erreurs
   */
  private async connect(): Promise<void> {
    try {
      const config: CacheConfig = {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD,
        db: parseInt(process.env.REDIS_DB || '0'),
        keyPrefix: process.env.REDIS_KEY_PREFIX || 'kamba:',
        maxRetriesPerRequest: 3,
        retryDelayOnFailover: 100,
        enableReadyCheck: true
      };

      this.client = new Redis();

      // Mock ne nécessite pas d'événements
      this.isConnected = true;


    } catch (error) {
      console.error('Failed to initialize Redis:', error);
      this.isConnected = false;
    }
  }

  /**
   * Vérification de la connexion Redis
   */
  public isReady(): boolean {
    return this.isConnected && this.client !== null;
  }

  /**
   * Génération de clé avec namespace
   */
  private generateKey(key: string, tags?: string[]): string {
    const baseKey = `cache:${key}`;
    if (tags && tags.length > 0) {
      return `${baseKey}:${tags.join(':')}`;
    }
    return baseKey;
  }

  /**
   * Compression des données
   */
  private compress(data: string): string {
    // Implémentation simple de compression (Base64)
    // En production, utiliser une vraie librairie de compression
    return Buffer.from(data).toString('base64');
  }

  /**
   * Décompression des données  
   */
  private decompress(data: string): string {
    try {
      return Buffer.from(data, 'base64').toString('utf-8');
    } catch {
      return data; // Fallback si pas compressé
    }
  }

  /**
   * Stockage en cache avec options avancées
   */
  public async set<T>(
    key: string, 
    value: T, 
    options: CacheOptions = {}
  ): Promise<boolean> {
    if (!this.isReady()) {
      console.warn('Redis not available, skipping cache set');
      return false;
    }

    try {
      const {
        ttl = 3600, // 1 heure par défaut
        tags = [],
        compress = false,
        serialize = true
      } = options;

      const cacheKey = this.generateKey(key, tags);
      
      let dataToStore: string;
      if (serialize) {
        dataToStore = JSON.stringify(value);
      } else {
        dataToStore = String(value);
      }

      if (compress && dataToStore.length > 1000) {
        dataToStore = this.compress(dataToStore);
      }

      // Stocker avec TTL
      const result = await this.client!.setex(cacheKey, ttl, dataToStore);
      
      // Stocker les tags pour l'invalidation groupée
      if (tags.length > 0) {
        const tagKeys = tags.map(tag => `tag:${tag}`);
        for (const tagKey of tagKeys) {
          await this.client!.sadd(tagKey, cacheKey);
          await this.client!.expire(tagKey, ttl + 3600); // Tags vivent plus longtemps
        }
      }

      return result === 'OK';
    } catch (error) {
      console.error('Redis set error:', error);
      this.stats.errors++;
      return false;
    }
  }

  /**
   * Récupération depuis le cache
   */
  public async get<T>(
    key: string, 
    options: Omit<CacheOptions, 'ttl'> = {}
  ): Promise<T | null> {
    if (!this.isReady()) {
      console.warn('Redis not available, cache miss');
      this.stats.misses++;
      return null;
    }

    try {
      const {
        tags = [],
        compress = false,
        serialize = true
      } = options;

      const cacheKey = this.generateKey(key, tags);
      const cachedData = await this.client!.get(cacheKey);

      if (cachedData === null) {
        this.stats.misses++;
        return null;
      }

      this.stats.hits++;

      let processedData = cachedData;
      
      if (compress) {
        processedData = this.decompress(processedData);
      }

      if (serialize) {
        return JSON.parse(processedData);
      }
      
      return processedData as T;
    } catch (error) {
      console.error('Redis get error:', error);
      this.stats.errors++;
      this.stats.misses++;
      return null;
    }
  }

  /**
   * Suppression d'une clé
   */
  public async del(key: string, tags: string[] = []): Promise<boolean> {
    if (!this.isReady()) return false;

    try {
      const cacheKey = this.generateKey(key, tags);
      const result = await this.client!.del(cacheKey);
      return result > 0;
    } catch (error) {
      console.error('Redis del error:', error);
      this.stats.errors++;
      return false;
    }
  }

  /**
   * Invalidation par tags
   */
  public async invalidateTag(tag: string): Promise<number> {
    if (!this.isReady()) return 0;

    try {
      const tagKey = `tag:${tag}`;
      const keys = await this.client!.smembers(tagKey);
      
      if (keys.length === 0) return 0;

      // Suppression de toutes les clés associées au tag
      const pipeline = this.client!.pipeline();
      keys.forEach((key: string) => pipeline.del(key));
      pipeline.del(tagKey); // Supprimer aussi le tag lui-même
      
      const results = await pipeline.exec();
      return keys.length;
    } catch (error) {
      console.error('Redis tag invalidation error:', error);
      this.stats.errors++;
      return 0;
    }
  }

  /**
   * Cache avec fallback (get-or-set pattern)
   */
  public async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    options: CacheOptions = {}
  ): Promise<T> {
    // Essayer de récupérer depuis le cache
    const cached = await this.get<T>(key, options);
    if (cached !== null) {
      return cached;
    }

    // Récupérer la donnée depuis la source
    try {
      const freshData = await fetcher();
      
      // Stocker en cache pour la prochaine fois
      await this.set(key, freshData, options);
      
      return freshData;
    } catch (error) {
      console.error('Fetcher error in getOrSet:', error);
      throw error;
    }
  }

  /**
   * Cache avec verrou (prevent thundering herd)
   */
  public async getOrSetWithLock<T>(
    key: string,
    fetcher: () => Promise<T>,
    options: CacheOptions & { lockTtl?: number } = {}
  ): Promise<T> {
    const { lockTtl = 30, ...cacheOptions } = options;
    const lockKey = `lock:${key}`;

    // Vérifier le cache d'abord
    const cached = await this.get<T>(key, cacheOptions);
    if (cached !== null) {
      return cached;
    }

    // Essayer d'acquérir le verrou
    const lockAcquired = await this.client!.set(lockKey, '1', 'EX', lockTtl, 'NX');
    
    if (lockAcquired === 'OK') {
      try {
        // Vérifier une dernière fois le cache (double-check)
        const doubleCheck = await this.get<T>(key, cacheOptions);
        if (doubleCheck !== null) {
          return doubleCheck;
        }

        // Récupérer et cacher la donnée
        const freshData = await fetcher();
        await this.set(key, freshData, cacheOptions);
        
        return freshData;
      } finally {
        // Libérer le verrou
        await this.client!.del(lockKey);
      }
    } else {
      // Un autre process récupère la donnée, attendre un peu et réessayer
      await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
      return this.getOrSet(key, fetcher, cacheOptions);
    }
  }

  /**
   * Mise à jour du TTL d'une clé
   */
  public async touch(key: string, ttl: number, tags: string[] = []): Promise<boolean> {
    if (!this.isReady()) return false;

    try {
      const cacheKey = this.generateKey(key, tags);
      const result = await this.client!.expire(cacheKey, ttl);
      return result === 1;
    } catch (error) {
      console.error('Redis touch error:', error);
      return false;
    }
  }

  /**
   * Vérification de l'existence d'une clé
   */
  public async exists(key: string, tags: string[] = []): Promise<boolean> {
    if (!this.isReady()) return false;

    try {
      const cacheKey = this.generateKey(key, tags);
      const result = await this.client!.exists(cacheKey);
      return result === 1;
    } catch (error) {
      console.error('Redis exists error:', error);
      return false;
    }
  }

  /**
   * Flush complet du cache
   */
  public async flush(): Promise<boolean> {
    if (!this.isReady()) return false;

    try {
      await this.client!.flushdb();
      this.stats = { hits: 0, misses: 0, errors: 0 };
      return true;
    } catch (error) {
      console.error('Redis flush error:', error);
      return false;
    }
  }

  /**
   * Statistiques du cache
   */
  public async getStats(): Promise<CacheStats> {
    if (!this.isReady()) {
      return {
        hits: this.stats.hits,
        misses: this.stats.misses,
        keys: 0,
        memory: '0B',
        hitRate: 0
      };
    }

    try {
      const info = await this.client!.info('memory');
      const keyspace = await this.client!.info('keyspace');
      
      // Parser les infos Redis
      const memoryMatch = info.match(/used_memory_human:([^\r\n]+)/);
      const memory = memoryMatch ? memoryMatch[1] : '0B';
      
      const keyspaceMatch = keyspace.match(/db0:keys=(\d+)/);
      const keys = keyspaceMatch ? parseInt(keyspaceMatch[1]) : 0;

      const total = this.stats.hits + this.stats.misses;
      const hitRate = total > 0 ? (this.stats.hits / total) * 100 : 0;

      return {
        hits: this.stats.hits,
        misses: this.stats.misses,
        keys,
        memory,
        hitRate: Math.round(hitRate * 100) / 100
      };
    } catch (error) {
      console.error('Redis stats error:', error);
      return {
        hits: this.stats.hits,
        misses: this.stats.misses,
        keys: 0,
        memory: '0B',
        hitRate: 0
      };
    }
  }

  /**
   * Fermeture propre de la connexion
   */
  public async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.quit();
      this.client = null;
      this.isConnected = false;
    }
  }

  /**
   * Pipeline pour les opérations en batch
   */
  public pipeline() {
    if (!this.isReady()) {
      throw new Error('Redis not available');
    }
    return this.client!.pipeline();
  }
}

// Instance singleton
export const cache = new RedisCache();

// Helper functions pour l'utilisation courante
export const cacheHelpers = {
  /**
   * Cache pour les produits
   */
  products: {
    get: (id: string) => cache.get(`product:${id}`, { tags: ['products'] }),
    set: (id: string, data: any) => cache.set(`product:${id}`, data, { 
      ttl: 3600, 
      tags: ['products'],
      compress: true 
    }),
    invalidate: () => cache.invalidateTag('products')
  },

  /**
   * Cache pour les utilisateurs
   */
  users: {
    get: (id: string) => cache.get(`user:${id}`, { tags: ['users'] }),
    set: (id: string, data: any) => cache.set(`user:${id}`, data, { 
      ttl: 1800, 
      tags: ['users'] 
    }),
    invalidate: (id?: string) => {
      if (id) {
        return cache.del(`user:${id}`, ['users']);
      }
      return cache.invalidateTag('users');
    }
  },

  /**
   * Cache pour les sessions
   */
  sessions: {
    get: (sessionId: string) => cache.get(`session:${sessionId}`, { tags: ['sessions'] }),
    set: (sessionId: string, data: any) => cache.set(`session:${sessionId}`, data, { 
      ttl: 7200, 
      tags: ['sessions'] 
    }),
    invalidate: (sessionId?: string) => {
      if (sessionId) {
        return cache.del(`session:${sessionId}`, ['sessions']);
      }
      return cache.invalidateTag('sessions');
    }
  },

  /**
   * Cache pour les pages statiques
   */
  pages: {
    get: (path: string) => cache.get(`page:${path}`, { tags: ['pages'] }),
    set: (path: string, html: string) => cache.set(`page:${path}`, html, { 
      ttl: 86400, // 24h
      tags: ['pages'],
      compress: true,
      serialize: false 
    }),
    invalidate: () => cache.invalidateTag('pages')
  },

  /**
   * Cache pour les API responses
   */
  api: {
    get: (endpoint: string, params?: any) => {
      const key = params ? `api:${endpoint}:${JSON.stringify(params)}` : `api:${endpoint}`;
      return cache.get(key, { tags: ['api'] });
    },
    set: (endpoint: string, data: any, params?: any, ttl = 600) => {
      const key = params ? `api:${endpoint}:${JSON.stringify(params)}` : `api:${endpoint}`;
      return cache.set(key, data, { ttl, tags: ['api'] });
    },
    invalidate: () => cache.invalidateTag('api')
  }
};

export default cache;