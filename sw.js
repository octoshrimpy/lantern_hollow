const CACHE_NAME = 'lantern-mobile-v2';
const ASSETS = ['./', './index.html', './src/css/app.css', './src/js/main.js', './src/js/config.js', './src/js/controls.js', './src/js/render.js', './src/js/rng.js', './src/js/worldgen.js', './manifest.webmanifest'];
self.addEventListener('install', (event) => event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))));
self.addEventListener('fetch', (event) => event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request))));
