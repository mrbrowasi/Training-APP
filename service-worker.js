<<<<<<< HEAD
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
    })
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
=======
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('myapp-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/style.css',
        '/script.js',
        '/icon-192.png'
      ]);
    })
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
>>>>>>> 1432a9c9dcd62cfd77bf7b9a71695e9af3639ca5
});