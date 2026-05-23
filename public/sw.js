const CACHE_NAME = 'my-cache-v1';
const urlsToCache = [
  '/',
  '/css/styles.css',
  '/js/app.js',
  '/manifest.json',
  '/icon.png',
  '/sw-register.js'
];

// Install
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return Promise.allSettled(
          urlsToCache.map(url => cache.add(url).catch(err => console.log('Failed to cache:', url, err)))
        );
      })
  );
});

// Activate
self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});

// Fetch
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
      .catch(() => caches.match('/'))
  );
});