self.importScripts('./service-worker-assets.js');
const cacheName = 'blazor-pwa-cache-v193';
const includeAssets = [ /\.dll$/, /\.wasm$/, /\.js$/, /\.json$/, /\.css$/, /\.html$/, /\.woff2?$/, /\.ico$/, /\.png$/, /\.jpg$/, /\.jpeg$/, /\.svg$/ ];
const excludeAssets = [ /service-worker\.js$/, /service-worker\.published\.js$/ ];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(cacheName).then(cache => {
            const assets = self.assetsManifest.assets
                .filter(a => includeAssets.some(p => p.test(a.url)))
                .filter(a => !excludeAssets.some(p => p.test(a.url)))
                .map(a => new Request(a.url, { integrity: a.integrity, cache: 'no-cache' }));
            return cache.addAll(assets);
        })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => Promise.all(keys.map(k => {
            if (k !== cacheName) return caches.delete(k);
        })))
    );
});

self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;
    event.respondWith(
        caches.match(event.request).then(r => r || fetch(event.request))
        .catch(() => caches.match('index.html'))
    );
});
