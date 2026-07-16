self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('myapp-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/style.css',
        '/script.js',
        '/192image.png',
        '/512image.png',
      ]);
    }
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
