importScripts('serviceworker-cache-polyfill.js');
var CACHE_VERSION = '1442068654178';
var CURRENT_CACHES = {
  prefetch: 'prefetch-cache-v' + CACHE_VERSION
};
self.addEventListener('install', function(event) {
  var urlsToPrefetch = [
'assets/input_areas/images/clear.svg',
'assets/input_areas/images/clear_dark.svg',
'assets/input_areas/images/dialog.svg',
'assets/input_areas/images/dialog_active.svg',
'assets/input_areas/images/dialog_disabled.svg',
'assets/input_areas/images/dialog_disabled_rtl.svg',
'assets/input_areas/images/dialog_rtl.svg',
'assets/input_areas/images/search.svg',
'assets/input_areas/images/search_dark.svg',
'assets/progress_activity/images/ui/activity-ac12e4dc031d6afb5bb562564c3be861.png',
'assets/progress_activity/images/ui/activity@1.5x-eaf9553a5afb38b39b6441a274af14f3.png',
'assets/progress_activity/images/ui/activity@2.25x-d75e3ef505d7b0652b2406adea5259e6.png',
'assets/progress_activity/images/ui/activity@2x-bc93a9943c43b49c5a302e25e209f5a6.png',
'assets/progress_activity/images/ui/default-6c37279a91665eb23a8bdc820063fd29.png',
'assets/progress_activity/images/ui/default@1.5x-fc23a75ba3449bdd091acb0e28256d25.png',
'assets/progress_activity/images/ui/default@2.25x-6b30a698b790c6a9baa8cc56bed7b264.png',
'assets/progress_activity/images/ui/default@2x-44c79c15ebf43dd159922eb0b95aea17.png',
'assets/progress_activity/images/ui/light-4eba569f7e5925a0d7ee8e457bbcce79.png',
'assets/progress_activity/images/ui/light@1.5x-685547a63d588353189a92ff105da71e.png',
'assets/progress_activity/images/ui/light@2.25x-fbdbc30ac02d98e33445f31335b33915.png',
'assets/progress_activity/images/ui/light@2x-b85ef9e49f1ea5e9c83c2023fc4bddc4.png',
'assets/series-manager-75d5cedfdd3528054be967568c227cf1.css',
'assets/series-manager-d0228c7312089937470617f9d6cb3352.js',
'assets/switches/images/check/default-b4a50b0c3cfe231b3b16a844536f4359.png',
'assets/switches/images/check/default@1.5x-91d7069fa4cf35e9fd82bbd8b4db3dc2.png',
'assets/switches/images/check/default@2.25x-4ae0acbafb02ad10d2020351db3d2e2c.png',
'assets/switches/images/check/default@2x-2442595ce8d2a2773de9fd2ac1c0c21d.png',
'assets/vendor-900e1ccc0836ac1206026c77fc39c3d6.css',
'assets/vendor-ae58206e261fb0447a982dc26fa3cf54.js',
'fonts/fontawesome-webfont.woff',
'index.html'
];
urlsToPrefetch.push('/');
console.log('Handling install event. Resources to pre-fetch:', urlsToPrefetch);
  event.waitUntil(
    caches.open(CURRENT_CACHES['prefetch']).then(function(cache) {
      return cache.addAll(urlsToPrefetch.map(function(urlToPrefetch) {
        return new Request(urlToPrefetch, {mode: 'no-cors'});
      })).then(function() {
console.log('All resources have been fetched and cached.');
      });
    }).catch(function(error) {
      console.error('Pre-fetching failed:', error);
    })
  );
});
self.addEventListener('activate', function(event) {
  // Delete all caches that aren't named in CURRENT_CACHES.
  // While there is only one cache in this example, the same logic will handle the case where
  // there are multiple versioned caches.
  var expectedCacheNames = Object.keys(CURRENT_CACHES).map(function(key) {
    return CURRENT_CACHES[key];
  });
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (expectedCacheNames.indexOf(cacheName) === -1) {
            // If this cache name isn't present in the array of "expected" cache names, then delete it.
console.log('Deleting out of date cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
self.addEventListener('fetch', function(event) {
  if (new URL(event.request.url).origin !== new URL(self.location).origin) {
    return;
  }
console.log('Handling fetch event for', event.request.url);
console.log('Looking in caches for:', event.request.url);
  event.respondWith(
    // caches.match() will look for a cache entry in all of the caches available to the service worker.
    // It's an alternative to first opening a specific named cache and then matching on that.
    caches.match(event.request).then(function(response) {
      if (response) {
console.log('Found response in cache:', response);
        return response;
      }
console.log('No response found in cache. About to fetch from network:'+event.request);
      // event.request will always have the proper mode set ('cors, 'no-cors', etc.) so we don't
      // have to hardcode 'no-cors' like we do when fetch()ing in the install handler.
      return fetch(event.request).then(function(response) {
console.log('Response from network is:', response);
        return response;
      }).catch(function(error) {
        // This catch() will handle exceptions thrown from the fetch() operation.
        // Note that a HTTP error response (e.g. 404) will NOT trigger an exception.
        // It will return a normal response object that has the appropriate error code set.
        console.error('Fetching failed:', error);
        throw error;
      });
    })
  );
});