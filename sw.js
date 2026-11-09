const CACHE_NAME = 'inventory-cache-v1';
const ASSETS = [ './index.html', './manifest.json' ];

self.addEventListener('install', (event) => {
event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
self.skipWaiting();
});

self.addEventListener('activate', (event) => {
event.waitUntil(caches.keys().then((keys) => Promise.all(
keys.map((key) => { if (key !== CACHE_NAME) return caches.delete(key); })
)));
self.clients.claim();
});

self.addEventListener('fetch', (event) => {
event.respondWith(
fetch(event.request).catch(() => caches.match(event.request).then(res => res || caches.match('./index.html')))
);
});