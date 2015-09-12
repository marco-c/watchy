var Trakt = (function() {
  function request(url) {
    return new Promise(function(resolve, reject) {
      var request = new XMLHttpRequest();
      request.responseType = "json";

      request.open('GET', url);

      request.setRequestHeader('Content-Type', 'application/json');
      request.setRequestHeader('trakt-api-version', '2');
      request.setRequestHeader('trakt-api-key', Ember.TRAKT_API_KEY);

      request.onload = function() {
        console.log(request.response);
        resolve(request.response);
      };

      request.send();
    });
  }

  function search(query, type) {
    return request('https://api-v2launch.trakt.tv/search?query=' + query + '&type=' + type);
  }

  function getShow(traktID, extended) {
    var url = 'https://api-v2launch.trakt.tv/shows/' + traktID;
    if (extended) {
      url += '?extended=' + extended;
    }

    return request(url);
  }

  function getSeasons(traktID, extended) {
    var url = 'https://api-v2launch.trakt.tv/shows/' + traktID + '/seasons';
    if (extended) {
      url += '?extended=' + extended;
    }

    return request(url);
  }

  return {
    search: search,
    getShow: getShow,
    getSeasons: getSeasons,
  };
})();
