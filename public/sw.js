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
 *
 * Cache versioning: BUILD_ID below is a placeholder that scripts/stamp-sw.mjs
 * rewrites in dist/sw.js after every export, so each build gets its own cache
 * and the activate handler drops the previous one. Without that, the static
 * assets, which are served cache-first, outlived the HTML that referenced them
 * and a stale bundle could be paired with fresh markup.
 *
 * This file is copied into dist verbatim, so it never passes through a bundler
 * and the placeholder is the only injection point available. Left unstamped
 * (the dev server serves public/ directly) it falls back to a fixed name, which
 * is the old single-cache behaviour and is fine for local work.
 */

const BUILD_ID = '__BUILD_ID__';

const CACHE_PREFIX = 'saferide-shell';
// An unstamped BUILD_ID still carries its leading underscores, which a real
// build id never does.
const CACHE = CACHE_PREFIX + '-' + (BUILD_ID.startsWith('__') ? 'dev' : BUILD_ID);

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
      // Drop this app's earlier build caches and leave anything else on the
      // origin alone. Every previous build is a separate key now, so this is
      // what actually frees the stale assets.
      .then((keys) => Promise.all(
        keys
          .filter((k) => k !== CACHE && k.startsWith(CACHE_PREFIX))
          .map((k) => caches.delete(k)),
      ))
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
