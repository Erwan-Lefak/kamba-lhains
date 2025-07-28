// Advanced Service Worker for Kamba Lhains PWA
const CACHE_NAME = 'kamba-lhains-v1.2.0';
const RUNTIME_CACHE = 'kamba-runtime-v1';
const IMAGE_CACHE = 'kamba-images-v1';
const API_CACHE = 'kamba-api-v1';
const FONT_CACHE = 'kamba-fonts-v1';

// Cache strategies
const CACHE_STRATEGIES = {
  CACHE_FIRST: 'cache-first',
  NETWORK_FIRST: 'network-first',
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate',
  NETWORK_ONLY: 'network-only',
  CACHE_ONLY: 'cache-only'
};

// Static assets to precache
const PRECACHE_ASSETS = [
  '/',
  '/kambavers',
  '/offline',
  '/manifest.json',
  '/_next/static/css/app.css',
  // Add critical CSS and JS files
];

// Route configurations with different caching strategies
const ROUTE_CACHE_CONFIG = [
  {
    pattern: /^https:\/\/fonts\.googleapis\.com/,
    cache: FONT_CACHE,
    strategy: CACHE_STRATEGIES.STALE_WHILE_REVALIDATE,
    expiration: { maxAgeSeconds: 60 * 60 * 24 * 365 } // 1 year
  },
  {
    pattern: /^https:\/\/fonts\.gstatic\.com/,
    cache: FONT_CACHE,
    strategy: CACHE_STRATEGIES.CACHE_FIRST,
    expiration: { maxAgeSeconds: 60 * 60 * 24 * 365 } // 1 year
  },
  {
    pattern: /\.(png|jpg|jpeg|svg|gif|webp|avif)$/,
    cache: IMAGE_CACHE,
    strategy: CACHE_STRATEGIES.CACHE_FIRST,
    expiration: { 
      maxEntries: 100,
      maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
    }
  },
  {
    pattern: /\/api\//,
    cache: API_CACHE,
    strategy: CACHE_STRATEGIES.NETWORK_FIRST,
    expiration: { 
      maxEntries: 50,
      maxAgeSeconds: 60 * 5 // 5 minutes
    }
  },
  {
    pattern: /\/_next\/static\//,
    cache: RUNTIME_CACHE,
    strategy: CACHE_STRATEGIES.CACHE_FIRST,
    expiration: { maxAgeSeconds: 60 * 60 * 24 * 365 } // 1 year
  },
  {
    pattern: /\.(js|css)$/,
    cache: RUNTIME_CACHE,
    strategy: CACHE_STRATEGIES.STALE_WHILE_REVALIDATE,
    expiration: { maxAgeSeconds: 60 * 60 * 24 * 7 } // 1 week
  }
];

// Background sync configuration
const BACKGROUND_SYNC_TAGS = {
  FAVORITE_PRODUCT: 'favorite-product',
  ANALYTICS: 'analytics-data',
  FORM_SUBMISSION: 'form-submission'
};

// Install event - precache critical assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    Promise.all([
      // Precache critical assets
      caches.open(CACHE_NAME).then((cache) => {
        console.log('[SW] Precaching critical assets');
        return cache.addAll(PRECACHE_ASSETS);
      }),
      // Skip waiting to activate immediately
      self.skipWaiting()
    ])
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => 
              name.startsWith('kamba-') && 
              ![CACHE_NAME, RUNTIME_CACHE, IMAGE_CACHE, API_CACHE, FONT_CACHE].includes(name)
            )
            .map((name) => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      }),
      // Claim clients immediately
      self.clients.claim()
    ])
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and chrome-extension requests
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
    return;
  }

  // Handle different request types
  event.respondWith(handleRequest(request));
});

// Advanced request handler with strategy routing
async function handleRequest(request) {
  const url = new URL(request.url);
  
  // Find matching cache configuration
  const config = ROUTE_CACHE_CONFIG.find(({ pattern }) => pattern.test(request.url));
  
  if (config) {
    return handleWithStrategy(request, config);
  }

  // Default strategy for HTML pages
  if (request.headers.get('accept')?.includes('text/html')) {
    return handlePageRequest(request);
  }

  // Fallback to network
  return fetch(request);
}

// Strategy implementations
async function handleWithStrategy(request, config) {
  const { cache: cacheName, strategy, expiration } = config;

  switch (strategy) {
    case CACHE_STRATEGIES.CACHE_FIRST:
      return cacheFirst(request, cacheName, expiration);
    
    case CACHE_STRATEGIES.NETWORK_FIRST:
      return networkFirst(request, cacheName, expiration);
    
    case CACHE_STRATEGIES.STALE_WHILE_REVALIDATE:
      return staleWhileRevalidate(request, cacheName, expiration);
    
    case CACHE_STRATEGIES.CACHE_ONLY:
      return cacheOnly(request, cacheName);
    
    case CACHE_STRATEGIES.NETWORK_ONLY:
      return fetch(request);
    
    default:
      return fetch(request);
  }
}

// Cache first strategy
async function cacheFirst(request, cacheName, expiration) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  if (cachedResponse && !isExpired(cachedResponse, expiration)) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      await cache.put(request, networkResponse.clone());
      await cleanupCache(cache, expiration);
    }
    return networkResponse;
  } catch (error) {
    return cachedResponse || new Response('Network error', { status: 503 });
  }
}

// Network first strategy
async function networkFirst(request, cacheName, expiration) {
  const cache = await caches.open(cacheName);

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      await cache.put(request, networkResponse.clone());
      await cleanupCache(cache, expiration);
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await cache.match(request);
    if (cachedResponse && !isExpired(cachedResponse, expiration)) {
      return cachedResponse;
    }
    throw error;
  }
}

// Stale while revalidate strategy
async function staleWhileRevalidate(request, cacheName, expiration) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  // Start network request in background
  const networkResponsePromise = fetch(request).then(async (response) => {
    if (response.ok) {
      await cache.put(request, response.clone());
      await cleanupCache(cache, expiration);
    }
    return response;
  }).catch(() => null);

  // Return cached response immediately if available
  if (cachedResponse && !isExpired(cachedResponse, expiration)) {
    return cachedResponse;
  }

  // Wait for network response if no cache
  return await networkResponsePromise || new Response('Network error', { status: 503 });
}

// Cache only strategy
async function cacheOnly(request, cacheName) {
  const cache = await caches.open(cacheName);
  return await cache.match(request) || new Response('Not in cache', { status: 404 });
}

// Special handling for HTML pages
async function handlePageRequest(request) {
  try {
    // Try network first for HTML pages
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      await cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Fall back to cache
    const cache = await caches.open(RUNTIME_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page as last resort
    return caches.match('/offline') || new Response('Offline', { 
      status: 503,
      headers: { 'Content-Type': 'text/html' }
    });
  }
}

// Utility functions
function isExpired(response, expiration) {
  if (!expiration?.maxAgeSeconds) return false;
  
  const dateHeader = response.headers.get('date');
  if (!dateHeader) return false;
  
  const responseDate = new Date(dateHeader);
  const expirationDate = new Date(responseDate.getTime() + expiration.maxAgeSeconds * 1000);
  
  return Date.now() > expirationDate.getTime();
}

async function cleanupCache(cache, expiration) {
  if (!expiration?.maxEntries) return;
  
  const keys = await cache.keys();
  if (keys.length <= expiration.maxEntries) return;
  
  // Sort by date and remove oldest entries
  const responses = await Promise.all(
    keys.map(async (key) => ({
      key,
      response: await cache.match(key)
    }))
  );
  
  responses
    .sort((a, b) => {
      const dateA = new Date(a.response.headers.get('date') || 0);
      const dateB = new Date(b.response.headers.get('date') || 0);
      return dateA.getTime() - dateB.getTime();
    })
    .slice(0, keys.length - expiration.maxEntries)
    .forEach(({ key }) => cache.delete(key));
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  
  switch (event.tag) {
    case BACKGROUND_SYNC_TAGS.FAVORITE_PRODUCT:
      event.waitUntil(syncFavorites());
      break;
    
    case BACKGROUND_SYNC_TAGS.ANALYTICS:
      event.waitUntil(syncAnalytics());
      break;
    
    case BACKGROUND_SYNC_TAGS.FORM_SUBMISSION:
      event.waitUntil(syncFormSubmissions());
      break;
  }
});

// Sync implementations
async function syncFavorites() {
  try {
    const favorites = await getStoredData('pending-favorites');
    if (!favorites?.length) return;
    
    for (const favorite of favorites) {
      await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(favorite)
      });
    }
    
    await clearStoredData('pending-favorites');
    console.log('[SW] Favorites synced successfully');
  } catch (error) {
    console.error('[SW] Failed to sync favorites:', error);
    throw error;
  }
}

async function syncAnalytics() {
  try {
    const analytics = await getStoredData('pending-analytics');
    if (!analytics?.length) return;
    
    await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(analytics)
    });
    
    await clearStoredData('pending-analytics');
    console.log('[SW] Analytics synced successfully');
  } catch (error) {
    console.error('[SW] Failed to sync analytics:', error);
    throw error;
  }
}

async function syncFormSubmissions() {
  try {
    const forms = await getStoredData('pending-forms');
    if (!forms?.length) return;
    
    for (const form of forms) {
      await fetch(form.action, {
        method: form.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form.data)
      });
    }
    
    await clearStoredData('pending-forms');
    console.log('[SW] Form submissions synced successfully');
  } catch (error) {
    console.error('[SW] Failed to sync form submissions:', error);
    throw error;
  }
}

// IndexedDB helpers for offline storage
async function getStoredData(key) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('kamba-offline', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['offline-data'], 'readonly');
      const store = transaction.objectStore('offline-data');
      const getRequest = store.get(key);
      
      getRequest.onsuccess = () => resolve(getRequest.result?.data);
      getRequest.onerror = () => reject(getRequest.error);
    };
    
    request.onupgradeneeded = () => {
      const db = request.result;
      db.createObjectStore('offline-data', { keyPath: 'key' });
    };
  });
}

async function clearStoredData(key) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('kamba-offline', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['offline-data'], 'readwrite');
      const store = transaction.objectStore('offline-data');
      const deleteRequest = store.delete(key);
      
      deleteRequest.onsuccess = () => resolve();
      deleteRequest.onerror = () => reject(deleteRequest.error);
    };
  });
}

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  const options = {
    body: 'Nouvelle collection disponible !',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    tag: 'kamba-notification',
    data: {
      url: '/kambavers?section=collections'
    },
    actions: [
      {
        action: 'view',
        title: 'Voir la collection',
        icon: '/icons/action-view.png'
      },
      {
        action: 'dismiss',
        title: 'Ignorer',
        icon: '/icons/action-dismiss.png'
      }
    ]
  };

  if (event.data) {
    try {
      const payload = event.data.json();
      Object.assign(options, payload);
    } catch (error) {
      console.error('[SW] Failed to parse push payload:', error);
    }
  }

  event.waitUntil(
    self.registration.showNotification('Kamba Lhains', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action);
  
  event.notification.close();
  
  if (event.action === 'view' || !event.action) {
    const url = event.notification.data?.url || '/';
    
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        // Check if app is already open
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.navigate(url);
            return client.focus();
          }
        }
        
        // Open new window if app is not open
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
    );
  }
});

// Share target handling
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  if (url.pathname === '/share' && event.request.method === 'POST') {
    event.respondWith(handleShareTarget(event.request));
  }
});

async function handleShareTarget(request) {
  const formData = await request.formData();
  const title = formData.get('title') || '';
  const text = formData.get('text') || '';
  const url = formData.get('url') || '';
  const files = formData.getAll('images');
  
  // Redirect to share page with data
  const params = new URLSearchParams({
    title,
    text,
    url,
    files: files.length
  });
  
  return Response.redirect(`/share?${params}`, 302);
}

console.log('[SW] Service worker loaded successfully');