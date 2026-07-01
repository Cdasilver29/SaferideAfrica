/* Safe Ride Africa service worker.
 *
 * Expo web ships no service worker, so this is hand-rolled for the static
 * export. Strategy:
 *   - Precache the app shell routes on install (resilient: a failed URL does
 *     not abort the install).
 *   - Navigations: network-first, falling back to the cached route, then to the
 *     home shell, so the site opens offline once it has been visited online.
 *   - Static assets (hashed JS/CSS, fonts, images): cache-first, then network,
 *     caching each response so offline visits have what they need.
 */

const CACHE = 'saferide-shell-v1';

const SHELL_ROUTES = [
  '/',
  '/about',
  '/courses',
  '/services',
  '/branches',
  '/gallery',
  '/blog',
  '/contact',
  '/manifest.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) =>
      // Cache each URL individually so one 404 does not fail the whole install.
      Promise.all(SHELL_ROUTES.map((url) => cache.add(url).catch(() => {}))),
    ).then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Navigations: network-first so users get fresh HTML, cache as fallback.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((cached) => cached || caches.match('/'))),
    );
    return;
  }

  // Static assets: cache-first, then network (and cache the fetched response).
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        if (res && res.status === 200 && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE).then((cache) => cache.put(req, copy));
        }
        return res;
      });
    }),
  );
});
