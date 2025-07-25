# 🚀 Guide Redis Cache - Kamba Lhains

Ce guide détaille l'implémentation complète du système de cache Redis pour optimiser les performances de l'application e-commerce Kamba Lhains.

## 📋 Vue d'ensemble

Le système de cache Redis implémenté offre :

- **Cache distribué** haute performance avec Redis
- **Stratégies multiples** (Write-Through, Write-Behind, Cache-Aside, Multi-Level)
- **Invalidation intelligente** par tags et patterns
- **Middleware automatisé** pour APIs et pages
- **Monitoring en temps réel** avec dashboard
- **Warmup automatique** des données populaires

## 🏗️ Architecture

### Structure des Fichiers

```
lib/cache/
├── redis.ts           # Classe Redis principale
├── middleware.ts      # Middlewares de cache
└── strategies.ts      # Stratégies de cache avancées

pages/api/cache/
├── stats.ts          # API statistiques de cache
├── invalidate.ts     # API invalidation de cache
└── warmup.ts         # API warmup de cache

components/Analytics/
└── CacheMonitor.tsx  # Dashboard de monitoring
```

### Configuration Redis

```typescript
// Variables d'environnement
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_password
REDIS_DB=0
REDIS_KEY_PREFIX=kamba:
CACHE_ADMIN_TOKEN=your_admin_token
```

## 🔧 Utilisation de Base

### 1. Cache Simple

```typescript
import { cache } from '../lib/cache/redis';

// Stockage
await cache.set('user:123', userData, { 
  ttl: 3600,           // 1 heure
  tags: ['users'],     // Tags pour invalidation
  compress: true       // Compression automatique
});

// Récupération
const user = await cache.get('user:123', { tags: ['users'] });

// Suppression
await cache.del('user:123', ['users']);
```

### 2. Cache avec Fallback

```typescript
// Pattern get-or-set
const product = await cache.getOrSet(
  `product:${id}`,
  async () => {
    // Récupération depuis la base si cache miss
    return await fetchProductFromDB(id);
  },
  { ttl: 3600, tags: ['products'] }
);
```

### 3. Cache avec Verrou Anti-Thundering Herd

```typescript
// Évite les requêtes simultanées pour la même donnée
const data = await cache.getOrSetWithLock(
  'expensive-computation',
  async () => {
    return await performExpensiveOperation();
  },
  { ttl: 1800, lockTtl: 30 }
);
```

## 🎯 Stratégies de Cache

### 1. Cache-Aside (Lazy Loading)

```typescript
import { CacheAsideStrategy } from '../lib/cache/strategies';

const productCache = new CacheAsideStrategy(
  async (productId) => {
    return await fetchProduct(productId);
  },
  { ttl: 3600, tags: ['products'] }
);

// Utilisation
const product = await productCache.get('123');
```

### 2. Write-Through Cache

```typescript
import { WriteThroughCache } from '../lib/cache/strategies';

const userCache = new WriteThroughCache(
  async (userId) => await fetchUser(userId),
  async (userId, userData) => await updateUser(userId, userData),
  { ttl: 1800, tags: ['users'] }
);

// Lecture
const user = await userCache.get('123');

// Écriture (cache + base simultanément)
await userCache.set('123', updatedUser);
```

### 3. Write-Behind Cache

```typescript
import { WriteBehindCache } from '../lib/cache/strategies';

const apiCache = new WriteBehindCache(
  async (key) => await fetchData(key),
  async (key, data) => await saveData(key, data),
  { ttl: 600, tags: ['api'] },
  5000 // Flush toutes les 5 secondes
);

// Écriture immédiate en cache, différée en base
await apiCache.set('data:123', newData);
```

### 4. Multi-Level Cache (L1 + L2)

```typescript
import { MultiLevelCache } from '../lib/cache/strategies';

const sessionCache = new MultiLevelCache(
  async (sessionId) => await fetchSession(sessionId),
  { ttl: 7200, tags: ['sessions'] }
);

// Cache L1 (mémoire) + L2 (Redis)
const session = await sessionCache.get('session_abc123');
```

## 🔄 Middlewares

### 1. Middleware API

```typescript
import { withApiCache } from '../lib/cache/middleware';

// Dans votre API route
export default withApiCache(
  async (req) => {
    // Logique de votre API
    const data = await fetchApiData();
    return NextResponse.json(data);
  },
  {
    ttl: 600,                    // 10 minutes
    tags: ['api', 'products'],   // Tags pour invalidation
    includeQuery: true,          // Inclure query params dans la clé
    skipCache: (req) => {
      // Skip cache pour les utilisateurs connectés
      return !!req.headers.get('authorization');
    }
  }
);
```

### 2. Middleware Pages

```typescript
import { withPageCache } from '../lib/cache/middleware';

// Dans middleware.ts
export function middleware(request: NextRequest) {
  return withPageCache({
    ttl: 3600,           // 1 heure
    tags: ['pages'],
    skipCache: (req) => {
      // Skip pour les pages admin
      return req.nextUrl.pathname.startsWith('/admin');
    }
  })(request);
}
```

### 3. Invalidation Automatique

```typescript
import { withCacheInvalidation } from '../lib/cache/middleware';

export default withCacheInvalidation(
  async (req) => {
    // Logique de mutation (POST/PUT/DELETE)
    const result = await updateProduct(data);
    return NextResponse.json(result);
  },
  {
    tags: ['products', 'api'],     // Tags à invalider
    keys: ['products:featured'],   // Clés spécifiques
    customInvalidation: async (req) => {
      // Invalidation personnalisée
      const productId = req.url.split('/').pop();
      await cache.del(`product:${productId}`);
    }
  }
);
```

## 🏷️ Invalidation par Tags

### Principe

Les tags permettent d'invalider plusieurs clés en une seule opération :

```typescript
// Stocker avec tags
await cache.set('product:1', product1, { tags: ['products', 'featured'] });
await cache.set('product:2', product2, { tags: ['products', 'new'] });
await cache.set('category:electronics', category, { tags: ['products'] });

// Invalider tous les produits
await cache.invalidateTag('products'); // Invalide 3 clés

// Invalider seulement les produits featured
await cache.invalidateTag('featured'); // Invalide 1 clé
```

### Tags Recommandés

```typescript
// Tags par type de données
'products'     // Tous les produits
'users'        // Tous les utilisateurs  
'sessions'     // Toutes les sessions
'pages'        // Toutes les pages
'api'          // Toutes les réponses API

// Tags par catégorie
'products:featured'    // Produits vedettes
'products:new'         // Nouveaux produits
'users:premium'        // Utilisateurs premium

// Tags par route
'api:products'         // APIs produits
'pages:public'         // Pages publiques
```

## 🔥 Cache Warmup

### Warmup Automatique

```typescript
import { CacheWarmup } from '../lib/cache/strategies';

// Warmup des produits populaires
await CacheWarmup.warmupProducts([
  '1', '2', '3', '4', '5'
]);

// Warmup des pages importantes
await CacheWarmup.warmupPages([
  '/',
  '/boutique', 
  '/nouvelle-collection'
]);

// Warmup personnalisé
await CacheWarmup.warmupKeys({
  keys: ['user:123', 'cart:456'],
  fetcher: async (key) => {
    if (key.startsWith('user:')) {
      return await fetchUser(key.split(':')[1]);
    }
    return await fetchCart(key.split(':')[1]);
  },
  concurrency: 5,
  onProgress: (completed, total) => {
    console.log(`Warmup: ${completed}/${total}`);
  }
});
```

### Warmup via API

```bash
# Warmup des produits populaires
curl -X POST /api/cache/warmup \
  -H "Authorization: Bearer $CACHE_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"type": "products"}'

# Warmup des pages par défaut
curl -X POST /api/cache/warmup \
  -H "Authorization: Bearer $CACHE_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"type": "pages"}'

# Warmup personnalisé
curl -X POST /api/cache/warmup \
  -H "Authorization: Bearer $CACHE_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "custom",
    "items": ["product:1", "product:2", "/boutique"],
    "config": {
      "concurrency": 10,
      "ttl": 7200
    }
  }'
```

## 📊 Monitoring et Debugging

### Dashboard de Monitoring

Le composant `CacheMonitor` offre une interface complète :

```typescript
import CacheMonitor from '../components/Analytics/CacheMonitor';

// Dans votre page admin
<CacheMonitor 
  autoRefresh={true}
  refreshInterval={30000}
  onError={(error) => console.error('Cache error:', error)}
/>
```

### APIs de Monitoring

```bash
# Statistiques détaillées
curl /api/cache/stats

# Réponse
{
  "success": true,
  "data": {
    "hits": 1250,
    "misses": 150,
    "keys": 1000,
    "memory": "25.4MB",
    "hitRate": 89.3,
    "uptime": "2d 14h 30m",
    "connections": 12,
    "operations": {
      "gets": 1400,
      "sets": 800,
      "deletes": 50
    }
  }
}
```

### Invalidation via API

```bash
# Invalider par tag
curl -X POST /api/cache/invalidate \
  -H "Authorization: Bearer $CACHE_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"type": "tag", "value": "products"}'

# Invalider par clé
curl -X POST /api/cache/invalidate \
  -H "Authorization: Bearer $CACHE_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"type": "key", "value": "product:123"}'

# Invalider par pattern
curl -X POST /api/cache/invalidate \
  -H "Authorization: Bearer $CACHE_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"type": "pattern", "value": "user:*"}'

# Vider tout le cache
curl -X POST /api/cache/invalidate \
  -H "Authorization: Bearer $CACHE_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"type": "all"}'
```

## 🛠️ Helpers et Utilities

### Helpers Pré-configurés

```typescript
import { cacheHelpers } from '../lib/cache/redis';

// Cache produits
await cacheHelpers.products.set('123', productData);
const product = await cacheHelpers.products.get('123');
await cacheHelpers.products.invalidate(); // Tous les produits

// Cache utilisateurs
await cacheHelpers.users.set('456', userData);
const user = await cacheHelpers.users.get('456');
await cacheHelpers.users.invalidate('456'); // Utilisateur spécifique

// Cache sessions
await cacheHelpers.sessions.set('sess_abc', sessionData);
const session = await cacheHelpers.sessions.get('sess_abc');

// Cache pages
await cacheHelpers.pages.set('/boutique', htmlContent);
const html = await cacheHelpers.pages.get('/boutique');

// Cache API
await cacheHelpers.api.set('products', apiResponse, { limit: 10 });
const data = await cacheHelpers.api.get('products', { limit: 10 });
```

### Decorator pour Functions

```typescript
import { cached } from '../lib/cache/middleware';

// Function cachée automatiquement
const getExpensiveData = cached(
  async (userId: string, type: string) => {
    // Calcul coûteux
    return await performExpensiveCalculation(userId, type);
  },
  {
    keyGen: (userId, type) => `expensive:${userId}:${type}`,
    ttl: 3600,
    tags: ['calculations']
  }
);

// Utilisation transparente
const result = await getExpensiveData('123', 'premium');
```

### Debug Utilities

```typescript
import { cacheDebug } from '../lib/cache/middleware';

// Log des statistiques
await cacheDebug.logStats();

// Vérifier une clé
await cacheDebug.checkKey('product:123', ['products']);

// Lister les clés (dev seulement)
await cacheDebug.listKeys('user:*');
```

## 🚀 Optimisations Performance

### 1. Compression Automatique

```typescript
// Compression pour les grandes données
await cache.set('large-data', bigObject, {
  ttl: 3600,
  compress: true  // Compression automatique si > 1KB
});
```

### 2. Pipeline pour Batch Operations

```typescript
// Opérations en batch
const pipeline = cache.pipeline();
pipeline.set('key1', 'value1');
pipeline.set('key2', 'value2');
pipeline.set('key3', 'value3');
const results = await pipeline.exec();
```

### 3. Cache Multi-Niveau

```typescript
// L1 (mémoire locale) + L2 (Redis)
const multiCache = new MultiLevelCache(
  async (key) => await fetchData(key),
  { ttl: 3600, tags: ['data'] }
);

// Accès ultra-rapide pour les données fréquentes
const data = await multiCache.get('hot-data');
```

## 📈 Métriques et KPIs

### Métriques Importantes

```typescript
// Hit Rate (objectif: > 80%)
hitRate = hits / (hits + misses) * 100

// Temps de réponse moyen
avgResponseTime = totalResponseTime / totalRequests

// Utilisation mémoire
memoryEfficiency = usedMemory / availableMemory

// Throughput
requestsPerSecond = totalRequests / timeWindow
```

### Alertes Recommandées

```typescript
// Hit rate trop bas
if (hitRate < 70) {
  alert('Cache hit rate below 70%');
}

// Mémoire trop utilisée  
if (memoryUsage > 80) {
  alert('Cache memory usage above 80%');
}

// Trop d'erreurs
if (errorRate > 5) {
  alert('Cache error rate above 5%');
}
```

## 🔧 Configuration Production

### Redis Configuration

```bash
# redis.conf
maxmemory 2gb
maxmemory-policy allkeys-lru
save 900 1
save 300 10
save 60 10000
appendonly yes
appendfsync everysec
tcp-keepalive 300
timeout 0
```

### Variables d'Environnement

```env
# Production
REDIS_HOST=redis.production.com
REDIS_PORT=6380
REDIS_PASSWORD=super_secure_password
REDIS_DB=0
REDIS_KEY_PREFIX=kamba:prod:

# Cache settings
CACHE_DEFAULT_TTL=3600
CACHE_MAX_MEMORY=2gb
CACHE_ADMIN_TOKEN=ultra_secure_admin_token

# Monitoring
CACHE_MONITORING_ENABLED=true
CACHE_STATS_INTERVAL=30000
```

### Docker Compose

```yaml
# docker-compose.yml
services:
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
      - ./redis.conf:/usr/local/etc/redis/redis.conf
    command: redis-server /usr/local/etc/redis/redis.conf
    environment:
      - REDIS_PASSWORD=${REDIS_PASSWORD}
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 30s
      timeout: 10s
      retries: 5

volumes:
  redis_data:
```

## 🚨 Troubleshooting

### Problèmes Courants

#### 1. Connexion Redis Échoue

```typescript
// Vérification de connexion
if (!cache.isReady()) {
  console.error('Redis not connected');
  // Fallback sans cache
  return await fetchFromDatabase();
}
```

#### 2. Memory Overflow

```bash
# Nettoyer le cache
redis-cli FLUSHDB

# Ou via API
curl -X POST /api/cache/invalidate \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"type": "all"}'
```

#### 3. Hit Rate Faible

```typescript
// Analyser les patterns d'accès
await cacheDebug.logStats();

// Ajuster les TTL
const newTTL = currentTTL * 2; // Doubler la durée

// Warmup des données populaires
await CacheWarmup.warmupProducts(popularProductIds);
```

#### 4. Performance Dégradée

```typescript
// Vérifier la latence Redis
const start = Date.now();
await cache.get('test-key');
const latency = Date.now() - start;

if (latency > 100) {
  console.warn(`High Redis latency: ${latency}ms`);
}
```

## 🔄 Migration et Déploiement

### Migration de Cache

```typescript
// Script de migration
async function migrateCache() {
  // 1. Backup du cache actuel
  const keys = await cache.pipeline().keys('*').exec();
  
  // 2. Mise à jour des structures
  for (const key of keys) {
    const value = await cache.get(key);
    const newValue = transformData(value);
    await cache.set(key, newValue);
  }
  
  // 3. Cleanup ancien format
  await cache.invalidateTag('old-format');
}
```

### Déploiement Zero-Downtime

```bash
# 1. Déployer la nouvelle version avec cache backward-compatible
# 2. Migrer les données en arrière-plan
# 3. Basculer vers le nouveau format
# 4. Nettoyer l'ancien format
```

---

**📋 Ce système de cache Redis est conçu pour s'adapter aux besoins croissants de votre application e-commerce.**

*Dernière mise à jour : 2024-12-25*  
*Version : 1.0*  
*Responsable : Performance Team*