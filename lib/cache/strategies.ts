import { cache, cacheHelpers } from './redis';

/**
 * Stratégies de cache pour différents types de données
 */

// Types pour les stratégies
export interface CacheStrategy {
  get: (key: string) => Promise<any>;
  set: (key: string, value: any) => Promise<boolean>;
  invalidate: (key?: string) => Promise<any>;
}

export interface CacheWarmupConfig {
  keys: string[];
  fetcher: (key: string) => Promise<any>;
  concurrency?: number;
  onProgress?: (completed: number, total: number) => void;
}

/**
 * 1. Cache Write-Through
 * Les données sont écrites simultanément en cache et en base
 */
export class WriteThroughCache {
  constructor(
    private fetcher: (key: string) => Promise<any>,
    private updater: (key: string, value: any) => Promise<any>,
    private cacheConfig: { ttl: number; tags: string[] }
  ) {}

  async get(key: string): Promise<any> {
    // Essayer le cache d'abord
    const cached = await cache.get(key, { tags: this.cacheConfig.tags });
    if (cached !== null) {
      return cached;
    }

    // Récupérer depuis la source
    const data = await this.fetcher(key);
    
    // Mettre en cache
    await cache.set(key, data, this.cacheConfig);
    
    return data;
  }

  async set(key: string, value: any): Promise<boolean> {
    // Écrire en base ET en cache simultanément
    const [dbResult] = await Promise.allSettled([
      this.updater(key, value),
      cache.set(key, value, this.cacheConfig)
    ]);

    if (dbResult.status === 'rejected') {
      // Si l'écriture DB échoue, invalider le cache
      await cache.del(key, this.cacheConfig.tags);
      throw dbResult.reason;
    }

    return true;
  }

  async invalidate(key?: string): Promise<void> {
    if (key) {
      await cache.del(key, this.cacheConfig.tags);
    } else {
      await cache.invalidateTag(this.cacheConfig.tags[0]);
    }
  }
}

/**
 * 2. Cache Write-Behind (Write-Back)
 * Les données sont écrites en cache immédiatement, en base de façon asynchrone
 */
export class WriteBehindCache {
  private writeQueue = new Map<string, any>();
  private flushInterval: NodeJS.Timeout | null = null;

  constructor(
    private fetcher: (key: string) => Promise<any>,
    private updater: (key: string, value: any) => Promise<any>,
    private cacheConfig: { ttl: number; tags: string[] },
    private flushIntervalMs = 5000 // Flush toutes les 5 secondes
  ) {
    this.startFlushInterval();
  }

  async get(key: string): Promise<any> {
    // Vérifier la queue d'écriture d'abord
    if (this.writeQueue.has(key)) {
      return this.writeQueue.get(key);
    }

    return cacheHelpers.api.get(key) || this.fetcher(key);
  }

  async set(key: string, value: any): Promise<boolean> {
    // Écriture immédiate en cache
    await cache.set(key, value, this.cacheConfig);
    
    // Ajouter à la queue pour écriture différée en base
    this.writeQueue.set(key, value);
    
    return true;
  }

  private startFlushInterval(): void {
    this.flushInterval = setInterval(async () => {
      await this.flushWrites();
    }, this.flushIntervalMs);
  }

  private async flushWrites(): Promise<void> {
    if (this.writeQueue.size === 0) return;

    const entries = Array.from(this.writeQueue.entries());
    this.writeQueue.clear();

    // Écrire en base en batch
    const promises = entries.map(([key, value]) => 
      this.updater(key, value).catch(error => {
        console.error(`Write-behind error for key ${key}:`, error);
        // Remettre en queue en cas d'erreur
        this.writeQueue.set(key, value);
      })
    );

    await Promise.allSettled(promises);
  }

  async shutdown(): Promise<void> {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }
    await this.flushWrites(); // Flush final
  }
}

/**
 * 3. Cache-Aside (Lazy Loading)
 * L'application gère le cache manuellement
 */
export class CacheAsideStrategy {
  constructor(
    private fetcher: (key: string) => Promise<any>,
    private cacheConfig: { ttl: number; tags: string[] }
  ) {}

  async get(key: string): Promise<any> {
    return cache.getOrSetWithLock(
      key,
      () => this.fetcher(key),
      this.cacheConfig
    );
  }

  async set(key: string, value: any): Promise<boolean> {
    return cache.set(key, value, this.cacheConfig);
  }

  async invalidate(key?: string): Promise<void> {
    if (key) {
      await cache.del(key, this.cacheConfig.tags);
    } else {
      await cache.invalidateTag(this.cacheConfig.tags[0]);
    }
  }
}

/**
 * 4. Multi-Level Cache
 * Cache L1 (mémoire) + L2 (Redis)
 */
export class MultiLevelCache {
  private l1Cache = new Map<string, { value: any; expires: number }>();
  private l1MaxSize = 1000;
  private l1TTL = 60000; // 1 minute en L1

  constructor(
    private fetcher: (key: string) => Promise<any>,
    private l2Config: { ttl: number; tags: string[] }
  ) {}

  async get(key: string): Promise<any> {
    // Vérifier L1 (mémoire)
    const l1Entry = this.l1Cache.get(key);
    if (l1Entry && l1Entry.expires > Date.now()) {
      return l1Entry.value;
    }

    // Vérifier L2 (Redis)
    const l2Value = await cache.get(key, { tags: this.l2Config.tags });
    if (l2Value !== null) {
      // Repeupler L1
      this.setL1(key, l2Value);
      return l2Value;
    }

    // Récupérer depuis la source
    const value = await this.fetcher(key);
    
    // Mettre en L1 et L2
    this.setL1(key, value);
    await cache.set(key, value, this.l2Config);
    
    return value;
  }

  private setL1(key: string, value: any): void {
    // Éviter la croissance infinie du cache L1
    if (this.l1Cache.size >= this.l1MaxSize) {
      const firstKey = this.l1Cache.keys().next().value;
      if (firstKey) {
        this.l1Cache.delete(firstKey);
      }
    }

    this.l1Cache.set(key, {
      value,
      expires: Date.now() + this.l1TTL
    });
  }

  async invalidate(key?: string): Promise<void> {
    if (key) {
      this.l1Cache.delete(key);
      await cache.del(key, this.l2Config.tags);
    } else {
      this.l1Cache.clear();
      await cache.invalidateTag(this.l2Config.tags[0]);
    }
  }
}

/**
 * 5. Time-based Cache Invalidation
 * Invalidation automatique basée sur le temps
 */
export class TimeBasedCache {
  private invalidationSchedule = new Map<string, NodeJS.Timeout>();

  constructor(
    private fetcher: (key: string) => Promise<any>,
    private cacheConfig: { ttl: number; tags: string[] }
  ) {}

  async get(key: string): Promise<any> {
    return cache.getOrSet(key, () => this.fetcher(key), this.cacheConfig);
  }

  async set(key: string, value: any, customTTL?: number): Promise<boolean> {
    const ttl = customTTL || this.cacheConfig.ttl;
    
    // Programmer l'invalidation
    this.scheduleInvalidation(key, ttl * 1000);
    
    return cache.set(key, value, { ...this.cacheConfig, ttl });
  }

  private scheduleInvalidation(key: string, delayMs: number): void {
    // Annuler l'ancien timer s'il existe
    const existingTimer = this.invalidationSchedule.get(key);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // Programmer la nouvelle invalidation
    const timer = setTimeout(async () => {
      await cache.del(key, this.cacheConfig.tags);
      this.invalidationSchedule.delete(key);
      console.log(`🕐 Time-based invalidation for key: ${key}`);
    }, delayMs);

    this.invalidationSchedule.set(key, timer);
  }

  async invalidate(key?: string): Promise<void> {
    if (key) {
      const timer = this.invalidationSchedule.get(key);
      if (timer) {
        clearTimeout(timer);
        this.invalidationSchedule.delete(key);
      }
      await cache.del(key, this.cacheConfig.tags);
    } else {
      for (const timer of Array.from(this.invalidationSchedule.values())) {
        clearTimeout(timer);
      }
      this.invalidationSchedule.clear();
      await cache.invalidateTag(this.cacheConfig.tags[0]);
    }
  }
}

/**
 * 6. Cache Warmup Strategy
 * Pré-chargement du cache avec des données populaires
 */
export class CacheWarmup {
  static async warmupKeys(config: CacheWarmupConfig): Promise<void> {
    const { keys, fetcher, concurrency = 5, onProgress } = config;
    let completed = 0;

    console.log(`🔥 Starting cache warmup for ${keys.length} keys...`);

    // Traitement par batch pour contrôler la concurrence
    for (let i = 0; i < keys.length; i += concurrency) {
      const batch = keys.slice(i, i + concurrency);
      
      const promises = batch.map(async (key) => {
        try {
          const value = await fetcher(key);
          await cache.set(key, value, { ttl: 3600, tags: ['warmup'] });
          completed++;
          onProgress?.(completed, keys.length);
        } catch (error) {
          console.error(`Warmup failed for key ${key}:`, error);
          completed++;
          onProgress?.(completed, keys.length);
        }
      });

      await Promise.allSettled(promises);
    }

    console.log(`✅ Cache warmup completed: ${completed}/${keys.length} keys`);
  }

  /**
   * Warmup des produits populaires
   */
  static async warmupProducts(productIds: string[]): Promise<void> {
    await this.warmupKeys({
      keys: productIds,
      fetcher: async (productId) => {
        // Simuler récupération produit
        const response = await fetch(`/api/products/${productId}`);
        return response.json();
      },
      concurrency: 10,
      onProgress: (completed, total) => {
        console.log(`Products warmup: ${completed}/${total}`);
      }
    });
  }

  /**
   * Warmup des pages statiques
   */
  static async warmupPages(paths: string[]): Promise<void> {
    await this.warmupKeys({
      keys: paths,
      fetcher: async (path) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${path}`);
        return response.text();
      },
      concurrency: 3, // Plus conservateur pour les pages
      onProgress: (completed, total) => {
        console.log(`Pages warmup: ${completed}/${total}`);
      }
    });
  }
}

/**
 * Factory pour créer des stratégies de cache
 */
export class CacheStrategyFactory {
  static createProductCache(): CacheAsideStrategy {
    return new CacheAsideStrategy(
      async (productId) => {
        // Récupération produit depuis l'API
        const response = await fetch(`/api/products/${productId}`);
        return response.json();
      },
      { ttl: 3600, tags: ['products'] }
    );
  }

  static createUserCache(): WriteThroughCache {
    return new WriteThroughCache(
      async (userId) => {
        // Récupération utilisateur
        const response = await fetch(`/api/users/${userId}`);
        return response.json();
      },
      async (userId, userData) => {
        // Mise à jour utilisateur
        const response = await fetch(`/api/users/${userId}`, {
          method: 'PUT',
          body: JSON.stringify(userData),
          headers: { 'Content-Type': 'application/json' }
        });
        return response.json();
      },
      { ttl: 1800, tags: ['users'] }
    );
  }

  static createSessionCache(): MultiLevelCache {
    return new MultiLevelCache(
      async (sessionId) => {
        // Récupération session depuis la base
        const response = await fetch(`/api/auth/session/${sessionId}`);
        return response.json();
      },
      { ttl: 7200, tags: ['sessions'] }
    );
  }

  static createApiCache(): WriteBehindCache {
    return new WriteBehindCache(
      async (key) => {
        // Récupération générique
        const response = await fetch(`/api/${key}`);
        return response.json();
      },
      async (key, data) => {
        // Sauvegarde générique
        const response = await fetch(`/api/${key}`, {
          method: 'POST',
          body: JSON.stringify(data),
          headers: { 'Content-Type': 'application/json' }
        });
        return response.json();
      },
      { ttl: 600, tags: ['api'] }
    );
  }
}

// Les exports sont déjà faits dans les déclarations de classes