var VERSION = "1";
var CACHE_KEY = "cache-" + VERSION;

var urlsToCache = [
  "index.html",
  "assets/series-manager.js",
  "assets/series-manager.css",
  "assets/vendor.js",
  "assets/vendor.css",
  "fonts/fontawesome-webfont.woff",
];

self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(CACHE_KEY).then(function(cache) {
      console.log("Opened cache: " + CACHE_KEY);
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("activate", function(event) {
  event.waitUntil(caches.keys().then(function(keys) {
    return Promise.all(keys.map(function(key) {
      if (key !== CACHE_KEY) {
        console.log("Delete cache: " + key);
        return caches.delete(key);
      }
    }));
  }));
});

self.addEventListener("fetch", function(event) {
  // This is temporarily needed because of https://bugzilla.mozilla.org/show_bug.cgi?id=1201999
  var cached = urlsToCache.find(function(url) {
    return event.request.url == new URL(url, self.location).href;
  });

  if (cached) {
    event.respondWith(
      caches.match(event.request).then(function(response) {
        console.log(event.request.url + " cache " + (response ? "hit!" : "miss!"));
        return response || fetch(event.request);
      })
    );
  } else {
    return fetch(event.request);
  }
});
