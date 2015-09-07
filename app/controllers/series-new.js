import Ember from 'ember';

import Series from 'series-manager/models/series';

export default Ember.Controller.extend({
  isSearching: false,

  resultCount: 0,
  results: null,

  search: function(query) {
      var _this = this;

      var series = new Series();

      if (this.get('isSearching')) {
          return;
      }

      this.set('isSearching', true);

      return new Promise(function(resolve, reject) {
        var request = new XMLHttpRequest({ mozSystem: true });
        request.responseType = "json";

        request.open('GET', 'https://api-v2launch.trakt.tv/shows/trending');

        request.setRequestHeader('Content-Type', 'application/json');
        request.setRequestHeader('trakt-api-version', '2');
        request.setRequestHeader('trakt-api-key', Ember.TRAKT_API_KEY);

        request.onload = function() {
          console.log(request.response);
          resolve(request.response);
        };

        request.send();
      }).then(function(shows) {
        return Promise.all(shows.map(function(show) {
          return new Promise(function(resolve, reject) {
            var request = new XMLHttpRequest({ mozSystem: true });
            request.responseType = "json";

            request.open('GET', 'https://api-v2launch.trakt.tv/shows/' + show.show.ids.trakt + '?extended=full,images');

            request.setRequestHeader('Content-Type', 'application/json');
            request.setRequestHeader('trakt-api-version', '2');
            request.setRequestHeader('trakt-api-key', Ember.TRAKT_API_KEY);

            request.onload = function() {
              console.log(request.response);
              var details = request.response;
              _this.store.query("series", { traktID: details.ids.trakt }).then(function(shows) {
                if (shows.get("length") > 0) {
                  details.isInDB = true;
                }
                resolve(details);
              }, function(err) {
                console.log(err);
                resolve(details);
              });
            };

            request.send();
          });
        })).then(function(results) {
          _this.set('isSearching', false);
          _this.set('results', results);
          _this.set('resultCount', results.length);
        });
      });
  },

  actions: {
      search: function(query) {
          this.search(this.get('query'));
      },

      add: function(show) {
        var _this = this;

        if (window.confirm("Add " + show.title + " to your list?")) {
          var request = new XMLHttpRequest({ mozSystem: true });
          request.responseType = "json";

            request.open('GET', 'https://api-v2launch.trakt.tv/shows/' + show.ids.trakt + '/seasons?extended=episodes');

            request.setRequestHeader('Content-Type', 'application/json');
            request.setRequestHeader('trakt-api-version', '2');
            request.setRequestHeader('trakt-api-key', Ember.TRAKT_API_KEY);

            request.onload = function() {
              console.log(request.response);

              var traktSeasons = request.response;
              var seasonsLeft = traktSeasons.length;

              var seasons = [];

              var allSeasonsAdded = new Promise(function(resolve, reject) {
                function addSeason(num, episodes) {
                  var season = _this.store.createRecord('season', {
                    number: num,
                    episodes: episodes,
                  });

                  seasons.push(season);

                  season.save().then(function() {
                    if (--seasonsLeft === 0) {
                      resolve();
                    }
                  });
                }


                for (var i = 0; i < traktSeasons.length; i++) {
                  var episodes = [];

                  var traktEpisodes = traktSeasons[i].episodes;
                  for (var j = 0; j < traktEpisodes.length; j++) {
                    episodes.push(_this.store.createRecord('episode', {
                      number: traktEpisodes[j].number,
                      title: traktEpisodes[j].title,
                    }));
                  }

                  Promise.all(episodes.map(function(episode) { return episode.save(); })).then(addSeason.bind(null, traktSeasons[i].number, episodes));
                }
              });

              allSeasonsAdded.then(function() {
                var series = _this.store.createRecord('series', {
                  title: show.title,
                  overview: show.overview,
                  rating: show.rating,
                  image: show.images.poster.thumb,
                  traktID: show.ids.trakt,
                  seasons: seasons,
                  status: show.status,
                  runtime: show.runtime,
                });
                series.save().then(function() { window.alert("Show added"); });
              });
            };

            request.send();
          }
      }
  }
});
