const filesToCache = [
  '/',
  'consultation',
  //'login',
  'su_admin',
  'client',
  'register',
  //'fonts/open-iconic.woff', // has bust, the font is auto loaded
  'images/loader.svg',
  'css/app.css',
  'css/anychart-ui.min.css',
  'favicon.ico',
  'manifest.webmanifest',
  'js/app.js',
  'js/anychart-bundle.js',
  'images/logo-192.png'
];

var blacklist = ['/csrf', '/logs/'];

const staticCacheName = 'pages-cache-v9';

function stripQueryStringAndHashFromPath(url) {
  return url.split("?")[0].split("#")[0];
}

self.addEventListener('install', event => {
  /*console.log('Attempting to install service worker and cache static assets');*/
  self.skipWaiting();
  event.waitUntil(
    caches.open(staticCacheName)
      .then(cache => {
        return cache.addAll(filesToCache);
      })
  );
});

self.addEventListener('activate', event => {
  /*console.log('Activating new service worker...');*/
  unregister(event);
});

function cleanResponse(response) {
  const clonedResponse = response.clone();

  // Not all browsers support the Response.body stream, so fall back to reading
  // the entire body into memory as a blob.
  const bodyPromise = 'body' in clonedResponse ?
    Promise.resolve(clonedResponse.body) :
    clonedResponse.blob();

  return bodyPromise.then((body) => {
    // new Response() is happy when passed either a stream or a Blob.
    return new Response(body, {
      headers: clonedResponse.headers,
      status: clonedResponse.status,
      statusText: clonedResponse.statusText,
    });
  });
}

function unregister(event) {
  console.warn('unregister');
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
}


self.addEventListener('fetch', event => {
  /*console.log('Fetch event for ', event.request.url);*/
  if (blacklist.find(element => event.request.url.indexOf(element) !== -1)) { return; }
  /*if (event.request.url.indexOf('fonts/') !== -1) {
    event.request = new Request(stripQueryStringAndHashFromPath(event.request.url), event.request);
    
  }*/

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          if (response.redirected) {
            response = cleanResponse(response);
          }
          return response;
        }
        return fetch(event.request)
          .then(response => {
            if (typeof response === 'undefined' || response.status === 403 || response.status === 419) {
              console.warn('req', event.request, 'resp', response);
              unregister(event);
              return response;
            }
            return caches.open(staticCacheName)
              .then(cache => {
                console.log('saving to cache ', event.request.url);
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



