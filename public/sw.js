/**
 * PflegeNavigator EU - Service Worker
 * Cache-Strategie: Stale-while-revalidate
 * Version: 1.0.0
 */

const CACHE_NAME = 'pflegenav-v1';
const STATIC_CACHE_URLS = [
  '/',
  '/pflegegrad/start',
  '/briefe',
  '/offline.html',
  '/styles/main.css',
  '/_next/static/css',
  '/_next/static/chunks',
];

const ICON_SIZES = [72, 96, 128, 144, 152, 192, 384, 512];
const ICON_URLS = ICON_SIZES.map(size => `/icons/icon-${size}x${size}.png`);

const STATIC_ASSETS = [...STATIC_CACHE_URLS, ...ICON_URLS];

// Installationsphase: Cache initialisieren
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets...');
        // Nur erfolgreiche Requests cachen
        return cache.addAll(STATIC_ASSETS.map(url => new Request(url, { 
          mode: 'no-cors',
          cache: 'default'
        }))).catch(err => {
          console.warn('[SW] Some assets failed to cache:', err);
        });
      })
      .then(() => {
        console.log('[SW] Installation complete');
        return self.skipWaiting();
      })
      .catch((err) => {
        console.error('[SW] Installation failed:', err);
      })
  );
});

// Aktivierungsphase: Alte Caches löschen
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => {
        console.log('[SW] Activation complete');
        return self.clients.claim();
      })
      .catch((err) => {
        console.error('[SW] Activation failed:', err);
      })
  );
});

// Fetch-Event: Stale-while-revalidate Strategie
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Nur GET-Requests cachen
  if (request.method !== 'GET') {
    return;
  }
  
  // API-Calls nicht cachen
  if (url.pathname.startsWith('/api/')) {
    return;
  }
  
  // Analytics nicht cachen
  if (url.hostname.includes('analytics') || url.hostname.includes('umami')) {
    return;
  }

  // Stale-while-revalidate für HTML-Seiten
  if (request.mode === 'navigate' || request.headers.get('Accept').includes('text/html')) {
    event.respondWith(staleWhileRevalidate(request, true));
    return;
  }
  
  // Stale-while-revalidate für statische Assets (CSS, JS, Bilder)
  if (isStaticAsset(url.pathname)) {
    event.respondWith(staleWhileRevalidate(request, false));
    return;
  }
  
  // Standard: Network-first mit Cache-Fallback
  event.respondWith(networkFirstWithCacheFallback(request));
});

/**
 * Stale-while-revalidate Strategie
 * Liefert gecachte Version sofort, aktualisiert im Hintergrund
 */
async function staleWhileRevalidate(request, isNavigation) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  // Im Hintergrund aktualisieren
  const fetchPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse && networkResponse.status === 200) {
        const clonedResponse = networkResponse.clone();
        cache.put(request, clonedResponse);
      }
      return networkResponse;
    })
    .catch((err) => {
      console.log('[SW] Network fetch failed:', err);
      return null;
    });
  
  // Für Navigation: Cached Version oder fetch
  if (isNavigation) {
    if (cachedResponse) {
      // Cached Version zurückgeben, im Hintergrund aktualisieren
      fetchPromise;
      return cachedResponse;
    }
    
    // Kein Cache: Versuche Netzwerk
    try {
      const networkResponse = await fetchPromise;
      if (networkResponse) {
        return networkResponse;
      }
    } catch (err) {
      console.log('[SW] Network failed, showing offline page');
    }
    
    // Fallback: Offline-Seite
    const offlineResponse = await cache.match('/offline.html');
    if (offlineResponse) {
      return offlineResponse;
    }
    
    // Letzter Fallback
    return new Response(
      '<html><body><h1>Offline</h1><p>Du bist offline.</p></body></html>',
      { headers: { 'Content-Type': 'text/html' } }
    );
  }
  
  // Für Assets: Cache oder Netzwerk
  if (cachedResponse) {
    fetchPromise; // Aktualisiere im Hintergrund
    return cachedResponse;
  }
  
  return fetchPromise;
}

/**
 * Network-first mit Cache-Fallback
 */
async function networkFirstWithCacheFallback(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (err) {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw err;
  }
}

/**
 * Prüft ob ein Pfad ein statisches Asset ist
 */
function isStaticAsset(pathname) {
  const staticExtensions = [
    '.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico',
    '.woff', '.woff2', '.ttf', '.otf', '.eot', '.json', '.webmanifest'
  ];
  
  return staticExtensions.some(ext => pathname.endsWith(ext)) ||
    pathname.includes('/_next/static/');
}

// Push-Notifications (optional, vorbereitet)
self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};
  
  const options = {
    body: data.body || 'Neue Benachrichtigung von PflegeNavigator',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    tag: data.tag || 'default',
    data: data.data || {},
    actions: data.actions || [],
    requireInteraction: false
  };
  
  event.waitUntil(
    self.registration.showNotification(
      data.title || 'PflegeNavigator EU',
      options
    )
  );
});

// Notification-Klicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Existierenden Tab fokussieren
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        // Neuen Tab öffnen
        if (self.clients.openWindow) {
          return self.clients.openWindow(urlToOpen);
        }
      })
  );
});

// Background Sync (optional, vorbereitet für spätere Features)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-tagebuch') {
    // Für später: Tagebuch-Einträge syncen wenn online
    console.log('[SW] Background sync triggered:', event.tag);
  }
});

console.log('[SW] Service Worker registered');
