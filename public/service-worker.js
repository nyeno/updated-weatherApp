'use strict';

// CODELAB: Update cache names any time any of the cached files change.
const CACHE_NAME = 'static-cache-v2';

const dataCacheName = 'weather-data-v1'

// CODELAB: Add list of files to cache here.
const FILES_TO_CACHE = [
  'offline.html',
  'style.css',
  '404.html',
  'main.js',
  'index.html',
  'img/icons/icon-32x32.png',
  'img/icons/icon-128x128.png',
  'img/icons/icon-144x144.png',
  'img/icons/icon-152x152.png',
  'img/icons/icon-192x192.png',
  'img/icons/icon-256x256.png',
  'img/icons/icon-512x512.png',
  'img/clear.jpg',
  'img/clouds.jpg',
  'img/mist.jpg',
  'img/rainy.jpg',
  'img/snow.jpg',
  'img/sunset.jpg',
  'img/thunder.jpg',


];

self.addEventListener('install', (evt) => {
  console.log('[ServiceWorker] Install');
  // CODELAB: Precache static resources here.
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Pre-caching offline pages');
      return cache.addAll(FILES_TO_CACHE);
    })
);
  self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
  console.log('[ServiceWorker] Activate');
  // CODELAB: Remove previous cached data from disk.
  evt.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME && key !== dataCacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
);
  self.clients.claim();
});

// Listen to fetching event
self.addEventListener('fetch', async function(e) {
  console.log('[Service Worker] Fetch', e.request.url);
  var dataUrl = 'https://api.openweathermap.org/data/2.5/weather';

  // Check if this is data or app shell request
    if (e.request.url.indexOf(dataUrl) > -1) {
      try{
        e.respondWith(
          caches.open(dataCacheName).then(function(cache) {
            return fetch(e.request).then(function(response){
              cache.put(e.request.url, response.clone());
              return response;
            })
          })
        );
      }catch (error) {
        // catch is only triggered if an exception is thrown, which is likely
        // due to a network error.
        // If fetch() returns a valid HTTP response with a response code in
        // the 4xx or 5xx range, the catch() will NOT be called.
        console.log('Fetch failed; returning offline page instead.', error);

        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match('/public/offline.html');
        return cachedResponse;
      }
    } else {
     try{
      e.respondWith(
        caches.match(e.request).then(function(response) {
          return response || fetch(e.request);
        })
      );
     } catch (error) {
      // catch is only triggered if an exception is thrown, which is likely
      // due to a network error.
      // If fetch() returns a valid HTTP response with a response code in
      // the 4xx or 5xx range, the catch() will NOT be called.
      console.log('Fetch failed; returning offline page instead.', error);

      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match('/public/offline.html');
      return cachedResponse;
    }
    }
});
/**self.addEventListener('fetch', function(e) {
  console.log('[ServiceWorker] Fetch', e.request.url);
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});*/
