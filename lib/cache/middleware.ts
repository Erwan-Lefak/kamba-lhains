import { NextRequest, NextResponse } from 'next/server';
import { cache } from './redis';

// Types pour la configuration du middleware de cache
export interface CacheMiddlewareConfig {
  ttl?: number;
  tags?: string[];
  varyBy?: string[]; // Headers à inclure dans la clé de cache
  skipCache?: (req: NextRequest) => boolean;
  onHit?: (key: string) => void;
  onMiss?: (key: string) => void;
  onError?: (error: Error) => void;
}

export interface CacheKeyConfig {
  includeQuery?: boolean;
  includeHeaders?: string[];
  excludeParams?: string[];
  customKeyGen?: (req: NextRequest) => string;
}

/**
 * Génère une clé de cache basée sur la requête
 */
function generateCacheKey(
  req: NextRequest, 
  config: CacheKeyConfig = {}
): string {
  const {
    includeQuery = true,
    includeHeaders = [],
    excludeParams = [],
    customKeyGen
  } = config;

  // Utiliser un générateur de clé personnalisé si fourni
  if (customKeyGen) {
    return customKeyGen(req);
  }

  const url = new URL(req.url);
  let key = `route:${url.pathname}`;

  // Inclure les paramètres de requête si demandé
  if (includeQuery && url.searchParams.size > 0) {
    const params = new URLSearchParams();
    
    for (const [name, value] of Array.from(url.searchParams.entries())) {
      if (!excludeParams.includes(name)) {
        params.set(name, value);
      }
    }
    
    if (params.size > 0) {
      // Trier les paramètres pour une clé cohérente
      const sortedParams = new URLSearchParams(Array.from(params.entries()).sort());
      key += `?${sortedParams.toString()}`;
    }
  }

  // Inclure certains headers dans la clé
  if (includeHeaders.length > 0) {
    const headerValues = includeHeaders
      .map(header => `${header}:${req.headers.get(header) || ''}`)
      .join('|');
    key += `|headers:${headerValues}`;
  }

  // Inclure la méthode HTTP
  key += `|${req.method}`;

  return key;
}

/**
 * Middleware de cache pour les API routes
 */
export function withApiCache(
  handler: (req: NextRequest) => Promise<NextResponse>,
  config: CacheMiddlewareConfig & CacheKeyConfig = {}
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const {
      ttl = 600, // 10 minutes par défaut
      tags = ['api'],
      skipCache,
      onHit,
      onMiss,
      onError,
      ...keyConfig
    } = config;

    // Vérifier si on doit skip le cache
    if (skipCache && skipCache(req)) {
      return handler(req);
    }

    // Seules les méthodes GET sont cachées par défaut
    if (req.method !== 'GET') {
      return handler(req);
    }

    const cacheKey = generateCacheKey(req, keyConfig);

    try {
      // Essayer de récupérer depuis le cache
      const cachedResponse = await cache.get<{
        status: number;
        headers: Record<string, string>;
        body: string;
      }>(cacheKey, { tags });

      if (cachedResponse) {
        onHit?.(cacheKey);
        
        // Reconstruire la réponse depuis le cache
        const response = new NextResponse(cachedResponse.body, {
          status: cachedResponse.status,
          headers: {
            ...cachedResponse.headers,
            'X-Cache': 'HIT',
            'X-Cache-Key': cacheKey
          }
        });

        return response;
      }

      onMiss?.(cacheKey);

      // Exécuter le handler original
      const response = await handler(req);
      
      // Cacher seulement les réponses réussies
      if (response.status >= 200 && response.status < 300) {
        const responseBody = await response.text();
        const responseHeaders: Record<string, string> = {};
        
        // Copier les headers importants
        response.headers.forEach((value, key) => {
          if (!key.toLowerCase().startsWith('x-cache')) {
            responseHeaders[key] = value;
          }
        });

        // Stocker en cache
        await cache.set(cacheKey, {
          status: response.status,
          headers: responseHeaders,
          body: responseBody
        }, { ttl, tags });

        // Retourner une nouvelle réponse avec les headers de cache
        return new NextResponse(responseBody, {
          status: response.status,
          headers: {
            ...responseHeaders,
            'X-Cache': 'MISS',
            'X-Cache-Key': cacheKey
          }
        });
      }

      return response;

    } catch (error) {
      console.error('Cache middleware error:', error);
      onError?.(error as Error);
      
      // En cas d'erreur, continuer sans cache
      return handler(req);
    }
  };
}

/**
 * Middleware de cache pour les pages Next.js
 */
export function withPageCache(config: CacheMiddlewareConfig = {}) {
  return function cacheMiddleware(req: NextRequest) {
    const {
      ttl = 3600, // 1 heure par défaut pour les pages
      tags = ['pages'],
      skipCache
    } = config;

    // Skip cache pour les requêtes authentifiées
    if (req.headers.get('authorization') || req.cookies.get('session')) {
      return NextResponse.next();
    }

    // Skip cache si configuré
    if (skipCache && skipCache(req)) {
      return NextResponse.next();
    }

    // Ajouter des headers de cache aux réponses statiques
    const response = NextResponse.next();
    
    // Cache-Control pour les navigateurs
    response.headers.set('Cache-Control', `public, max-age=${ttl}, s-maxage=${ttl}`);
    
    // Headers pour les CDN
    response.headers.set('CDN-Cache-Control', `public, max-age=${ttl}`);
    
    return response;
  };
}

/**
 * Invalidation de cache basée sur les mutations
 */
export function withCacheInvalidation(
  handler: (req: NextRequest) => Promise<NextResponse>,
  invalidationConfig: {
    tags?: string[];
    keys?: string[];
    customInvalidation?: (req: NextRequest) => Promise<void>;
  } = {}
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const { tags = [], keys = [], customInvalidation } = invalidationConfig;

    // Exécuter le handler original
    const response = await handler(req);

    // Invalider le cache seulement pour les mutations réussies
    if (
      ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method) &&
      response.status >= 200 && 
      response.status < 300
    ) {
      try {
        // Invalidation par tags
        for (const tag of tags) {
          await cache.invalidateTag(tag);
        }

        // Invalidation par clés spécifiques
        for (const key of keys) {
          await cache.del(key);
        }

        // Invalidation personnalisée
        if (customInvalidation) {
          await customInvalidation(req);
        }

        console.log(`Cache invalidated for ${req.method} ${req.url}`);
      } catch (error) {
        console.error('Cache invalidation error:', error);
      }
    }

    return response;
  };
}

/**
 * Hook pour invalider le cache depuis les components
 */
export const useCacheInvalidation = () => {
  return {
    invalidateTag: (tag: string) => cache.invalidateTag(tag),
    invalidateKey: (key: string) => cache.del(key),
    invalidateMultiple: async (tags: string[], keys: string[] = []) => {
      const promises = [
        ...tags.map(tag => cache.invalidateTag(tag)),
        ...keys.map(key => cache.del(key))
      ];
      await Promise.all(promises);
    }
  };
};

/**
 * Decorator pour les functions serverless
 */
export function cached<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  options: {
    keyGen: (...args: T) => string;
    ttl?: number;
    tags?: string[];
  }
) {
  return async (...args: T): Promise<R> => {
    const { keyGen, ttl = 600, tags = [] } = options;
    const key = keyGen(...args);

    return cache.getOrSetWithLock(
      key,
      () => fn(...args),
      { ttl, tags }
    );
  };
}

/**
 * Utilities pour debugging du cache
 */
export const cacheDebug = {
  /**
   * Log des statistiques de cache
   */
  logStats: async () => {
    const stats = await cache.getStats();
    console.log('📊 Cache Stats:', {
      hitRate: `${stats.hitRate}%`,
      hits: stats.hits,
      misses: stats.misses,
      keys: stats.keys,
      memory: stats.memory
    });
  },

  /**
   * Vérifier si une clé existe
   */
  checkKey: async (key: string, tags: string[] = []) => {
    const exists = await cache.exists(key, tags);
    const value = exists ? await cache.get(key, { tags }) : null;
    console.log(`🔍 Cache key "${key}":`, { exists, value });
    return { exists, value };
  },

  /**
   * Lister les clés par pattern (dev only)
   */
  listKeys: async (pattern = '*') => {
    if (process.env.NODE_ENV === 'production') {
      console.warn('listKeys disabled in production');
      return [];
    }
    
    try {
      const keys = await cache.pipeline().keys(pattern).exec();
      console.log(`🗝️  Keys matching "${pattern}":`, keys);
      return keys;
    } catch (error) {
      console.error('Error listing keys:', error);
      return [];
    }
  }
};

// Export par défaut avec configuration commune
export default {
  withApiCache,
  withPageCache, 
  withCacheInvalidation,
  cached,
  cacheDebug,
  useCacheInvalidation
};