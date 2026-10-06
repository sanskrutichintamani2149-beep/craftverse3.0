// DhanaDrishti Production Service Worker
// Enables offline support for Termopedia, Flashcards, Quiz, and the App Shell.
// Strictly network-only for all /api/* requests.

const CACHE_NAME = 'dhanadrishti-app-v1';

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon-32x32.png',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/logo.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // 1. NEVER cache any /api/* calls (auth, profile, AI, saved data, uploads)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(fetch(req));
    return;
  }

  // 2. Navigation requests (App Shell): Network-first with cached index.html fallback
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(async () => {
        const cache = await caches.open(CACHE_NAME);
        const cachedIndex = await cache.match('/index.html');
        return cachedIndex || cache.match('/');
      })
    );
    return;
  }

  // 3. Google Fonts: Stale-While-Revalidate
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(req);
        const networkFetch = fetch(req).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            cache.put(req, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => cachedResponse);

        return cachedResponse || networkFetch;
      })
    );
    return;
  }

  // 4. Offline Videos (supports byte range requests if cached)
  if (url.pathname.startsWith('/videos/offline/')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(req.url);
        if (cachedResponse) {
          const rangeHeader = req.headers.get('range');
          if (!rangeHeader) {
            return cachedResponse;
          }
          const arrayBuffer = await cachedResponse.arrayBuffer();
          const bytes = /^bytes=(\d+)-(\d+)?$/g.exec(rangeHeader);
          if (bytes) {
            const start = Number(bytes[1]);
            const end = bytes[2] ? Number(bytes[2]) : arrayBuffer.byteLength - 1;
            const chunk = arrayBuffer.slice(start, end + 1);
            return new Response(chunk, {
              status: 206,
              statusText: 'Partial Content',
              headers: [
                ['Content-Range', `bytes ${start}-${end}/${arrayBuffer.byteLength}`],
                ['Content-Length', String(chunk.byteLength)],
                ['Content-Type', cachedResponse.headers.get('Content-Type') || 'video/mp4'],
                ['Accept-Ranges', 'bytes'],
              ],
            });
          }
          return cachedResponse;
        }
        return fetch(req);
      })
    );
    return;
  }

  // 5. Same-origin static assets (JS, CSS, images, icons): Cache-first with network fallback
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(req).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(req).then((networkResponse) => {
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            (url.pathname.startsWith('/assets/') ||
              url.pathname.endsWith('.js') ||
              url.pathname.endsWith('.css') ||
              url.pathname.endsWith('.png') ||
              url.pathname.endsWith('.jpg') ||
              url.pathname.endsWith('.webp') ||
              url.pathname.endsWith('.svg'))
          ) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(req, responseClone);
            });
          }
          return networkResponse;
        });
      })
    );
  }
});
