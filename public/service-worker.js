const filesToCache = [
  'consultation',
  'su_admin',
  'client',
  'register',
  'fonts/open-iconic.woff?3cf97837524dd7445e9d1462e3c4afe2',
  'images/loader.svg',
  'css/app.css',
  'css/anychart-ui.min.css',
  'favicon.ico',
  'manifest.webmanifest',
  'js/app.js',
  'js/anychart-bundle.js',
  'images/logo-192.png'
];

const staticCacheName = 'pages-cache-v3';

function stripQueryStringAndHashFromPath(url) {
  return url.split("?")[0].split("#")[0];
}

self.addEventListener('install', event => {
  /*console.log('Attempting to install service worker and cache static assets');*/
  event.waitUntil(
    caches.open(staticCacheName)
    .then(cache => {
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', event => {
  /*console.log('Activating new service worker...');*/
  const cacheWhitelist = [staticCacheName];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  /*console.log('Fetch event for ', event.request.url);*/
  if (event.request.url.indexOf("csrf") !== -1) { return ;}
  /*if (event.request.url.indexOf('fonts/') !== -1) {
    event.request = new Request(stripQueryStringAndHashFromPath(event.request.url), event.request);
    
  }*/
  event.respondWith(
    caches.match(event.request)
    .then(response => {
      if (response) {
        /*console.log('Found ', event.request.url, ' in cache');*/
        return response;
      }
      /*console.log('Network request for ', event.request.url);*/
      return fetch(event.request)
      .then(response => {
        /*if (response.status === 404) {
          return caches.match('pages/404.html');
        }*/
        return caches.open(staticCacheName)
        .then(cache => {
          cache.put(event.request.url, response.clone());
          return response;
        });
      });
    })/*.catch(error => {
      console.log('Error, ', error);
      return caches.match('pages/offline.html');
    })*/
  );
});



