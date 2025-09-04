const CACHE_NAME = 'velarion-skies-v1';
const CACHE_TIMEOUT = 60000; // 60 seconds

// Files to cache on install
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/css/critical.css',
  '/assets/css/style.css',
  '/assets/js/main.js',
  '/assets/images/logo.svg',
  '/assets/images/favicon.ico'
];

// Install event - cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);
  
  // Only handle requests from the same origin
  if (requestUrl.origin !== location.origin) {
    return;
  }
  
  // Handle different asset types with different strategies
  if (requestUrl.pathname.startsWith('/assets/images/')) {
    // Images - stale-while-revalidate
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          // Return cached response immediately if available
          if (cachedResponse) {
            // Update cache in background
            event.waitUntil(
              fetch(event.request)
                .then(response => {
                  return caches.open(CACHE_NAME)
                    .then(cache => cache.put(event.request, response.clone()));
                })
            );
            return cachedResponse;
          }
          
          // If not in cache, fetch from network and cache
          return fetch(event.request)
            .then(response => {
              return caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, response.clone());
                  return response;
                });
            });
        })
    );
  } else if (requestUrl.pathname.startsWith('/assets/icons/')) {
    // Icons - cache first
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          return cachedResponse || fetch(event.request);
        })
    );
  } else {
    // Other assets - network first with timeout and fallback to cache
    event.respondWith(
      Promise.race([
        fetch(event.request),
        new Promise((resolve, reject) => {
          setTimeout(() => {
            reject(new Error('Request timeout'));
          }, CACHE_TIMEOUT);
        })
      ])
        .then(response => {
          // Cache the response
          return caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, response.clone());
              return response;
            });
        })
        .catch(() => {
          // Fallback to cache
          return caches.match(event.request);
        })
    );
  }
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              return caches.delete(cacheName);
            }
          })
        );
      })
  );
});