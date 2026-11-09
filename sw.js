const CACHE_NAME = 'inventory-app-v1';
const ASSETS_TO_CACHE = [
'./index.html',
'./manifest.json'
// 若你有圖示，也把它們加進來：'./icon-192.png', './icon-512.png'
];

// 安裝 Service Worker 並快取檔案
self.addEventListener('install', (event) => {
event.waitUntil(
caches.open(CACHE_NAME).then((cache) => {
return cache.addAll(ASSETS_TO_CACHE);
})
);
self.skipWaiting();
});

// 啟動 Service Worker
self.addEventListener('activate', (event) => {
event.waitUntil(
caches.keys().then((cacheNames) => {
return Promise.all(
cacheNames.map((name) => {
if (name !== CACHE_NAME) return caches.delete(name);
})
);
})
);
self.clients.claim();
});

// 攔截網路請求，若離線則提供快取的檔案
self.addEventListener('fetch', (event) => {
event.respondWith(
caches.match(event.request).then((response) => {
return response || fetch(event.request);
}).catch(() => {
// 若完全斷網且沒快取，退回 index.html
return caches.match('./index.html');
})
);
});