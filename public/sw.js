// Pages: network first (picks up new deploys), cache as offline fallback.
// Other files: Next.js hashes their names, so cache first is safe.
// shortcut: old deploys' files stay in the cache (a few hundred KB each), clear it if this ever grows noticeably.
const CACHE = 'workouts';

// precache.json is written by scripts/precache.js at build time.
self.addEventListener('install', (e) => {
  e.waitUntil(
    fetch('/precache.json', { cache: 'no-store' }).then((r) => r.json())
      .then((files) => caches.open(CACHE).then((c) => c.addAll(files)))
      .then(() => self.skipWaiting()),
  );
});
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', (e) => {
  const { request } = e;
  if (request.method !== 'GET' || new URL(request.url).origin !== location.origin) return;

  const save = (res) => {
    if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(request, copy)); }
    return res;
  };
  e.respondWith(
    request.mode === 'navigate'
      ? fetch(request).then(save).catch(() => caches.match(request).then((r) => r || caches.match('/')))
      : caches.match(request).then((r) => r || fetch(request).then(save)),
  );
});
