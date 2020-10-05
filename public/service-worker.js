var CACHE = 'network-or-cache1';
var PRECACHE = [
  'consultation',
  'su_admin',
  'client',
  'register',
  'fonts/open-iconic.woff',
  'images/loader.svg',
  'css/app.css',
  'css/anychart-ui.min.css',
  'favicon.ico',
  'manifest.webmanifest',
  'js/app.js',
  'js/anychart-bundle.js',
  'images/logo-192.png'
];


var CACHE_DYNAMIC_NAME, CACHE_CONTAINING_ERROR_MESSAGES;
// On install, cache some resource.
self.addEventListener('install', function(evt) {
  console.log('The service worker is being installed.');

  // Ask the service worker to keep installing until the returning promise
  // resolves.
  evt.waitUntil(precache());
});

// On fetch, use cache but update the entry with the latest contents
// from the server.
/*
self.addEventListener('fetch', function(evt) {
   if (evt.request.url.indexOf('/csrf') !== -1 ) {
    return false;
  }
  console.log('The service worker is serving the asset:' + evt.request.url);
  // Try network and if it fails, go for the cached copy.
  evt.respondWith(fromNetwork(evt.request, 400).catch(function () {
    return fromCache(evt.request);
  }));
});
*/
addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;     // if valid response is found in cache return it
        } else {
          return fetch(event.request)     //fetch from internet
            .then(function(res) {
              return res;

              if (event.request.url.indexOf('get?') !== -1) {
                return res;
              }
              if (event.request.url.indexOf('temp?') !== -1) {
                return res;
              }

              if (event.request.url.indexOf('csrf') !== -1) {
                return res;
              }
              console.log('url=',event.request.url)
              return caches.open(CACHE_DYNAMIC_NAME)
                .then(function(cache) {
                  console.log('caching ', event.request.url);
                  console.log(CACHE_DYNAMIC_NAME);
                  cache.put(event.request.url, res.clone());    //save the response for future
                  return res;   // return the fetched data
                })
                
            })
            .catch(function(err) {       // fallback mechanism
              return caches.open(CACHE_CONTAINING_ERROR_MESSAGES)
                .then(function(cache) {
                  return cache.match('/offline.html');
                });
            });
        }
      })
  );
});    

// Open a cache and use `addAll()` with an array of assets to add all of them
// to the cache. Return a promise resolving when all the assets are added.
function precache() {
  return caches.open(CACHE).then(function (cache) {
    return cache.addAll(PRECACHE);
  });
}

// Time limited network request. If the network fails or the response is not
// served before timeout, the promise is rejected.
function fromNetwork(request, timeout) {
  return new Promise(function (fulfill, reject) {
    // Reject in case of timeout.
    var timeoutId = setTimeout(reject, timeout);
    // Fulfill in case of success.
    fetch(request).then(function (response) {
      clearTimeout(timeoutId);
      fulfill(response);
    // Reject also if network fetch rejects.
    }, reject);
  });
}

// Open the cache where the assets were stored and search for the requested
// resource. Notice that in case of no matching, the promise still resolves
// but it does with `undefined` as value.
function fromCache(request) {
  return caches.open(CACHE).then(function (cache) {
    return cache.match(request).then(function (matching) {
      return matching || Promise.reject('no-match');
    });
  });
}

self.addEventListener('activate', (event) => {
  var cacheKeeplist = ['CACHE'];

  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (cacheKeeplist.indexOf(key) === -1) {
          return caches.delete(key);
        }
      }));
    })
  );
});