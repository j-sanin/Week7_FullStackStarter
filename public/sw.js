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
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching files');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
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