//start chaching project files
var CACHE_NAME = 'restaurant-cache1';

var allFiles = [
  "/",
  '/index.html',
  '/restaurant.html',
  '/css/styles.css',
  '/data/restaurants.json',
  '/img/1.jpg',
  '/img/2.jpg',
  '/img/3.jpg',
  '/img/4.jpg',
  '/img/5.jpg',
  '/img/6.jpg',
  '/img/7.jpg',
  '/img/8.jpg',
  '/img/9.jpg',
  '/img/10.jpg',
  '/img/13.jpg',
  '/img/26.jpg',
  '/img/logo.png',
  '/js/main.js',
  '/js/restaurant_info.js',
  '/js/dbhelper.js',
];

self.addEventListener('install', function(event) {
  //start install steps
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
          console.log('opened cache');
            return cache.addAll(allFiles);
        })
    );
});


self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.filter(function(cacheName) {
                    return cacheName.startsWith('restaurant-') &&
                        cacheName != CACHE_NAME;
                }).map(function(cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});


self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then(function(response) {
          if (response) {
            return response;
          }
          var fetchRequest = event.request.clone();
          return fetch(fetchRequest).then(function (response){
            if (!response || response.status !== 200) {
              return response;
            }
            var responseToCache = response.clone();
            caches.open(CACHE_NAME).then(function (cache) {
              cache.put(event.request, responseToCache);
            });
            return response;
          }
        );
      })
    );
})