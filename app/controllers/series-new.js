import Ember from 'ember';

import Series from 'series-manager/models/series';

export default Ember.Controller.extend({
  isSearching: false,

  resultCount: 0,
  results: null,

  search: function() {
    var searchQuery = document.getElementById("search-query").value;

    var _this = this;

    var series = new Series();

    if (this.get('isSearching')) {
      return;
    }

    this.set('isSearching', true);

    return Trakt.search(searchQuery, 'show').then(function(results) {
      return Promise.all(results.map(function(result) {
        return Trakt.getShow(result.show.ids.trakt, 'full,images').then(function(details) {
          // Preferably use the poster, otherwise any other type of image works.
          if (details.images.poster.thumb) {
            details.image = details.images.poster.thumb;
          } else {
            for (var type in details.images) {
              if (details.images[type].thumb) {
                details.image = details.images[type].thumb;
                break;
              }
            }
          }

          return _this.store.query("series", { traktID: details.ids.trakt }).then(function(shows) {
            if (shows.get("length") > 0) {
              details.isInDB = true;
            }
            return details;
          }, function(err) {
            console.log(err);
            return details;
          });
        });
      })).then(function(results) {
        _this.set('isSearching', false);
        _this.set('results', results);
        _this.set('resultCount', results.length);
      });
    });
  },

  actions: {
    add: function(show) {
      var _this = this;

      if (window.confirm("Add " + show.title + " to your list?")) {
        Trakt.getSeasons(show.ids.trakt, 'episodes').then(function(traktSeasons) {
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
              var episodePromises = [];

              var traktEpisodes = traktSeasons[i].episodes;
              for (var j = 0; j < traktEpisodes.length; j++) {
                episodePromises.push(Trakt.getEpisode(show.ids.trakt, traktSeasons[i].number, traktEpisodes[j].number, 'full').then(function(episode) {
                  return _this.store.createRecord('episode', {
                    number: episode.number,
                    title: episode.title,
                    description: episode.overview,
                    aired_date: new Date(episode.first_aired),
                    rating: episode.rating,
                  }).save();
                }));
              }

              Promise.all(episodePromises).then(addSeason.bind(null, traktSeasons[i].number));
            }
          });

          allSeasonsAdded.then(function() {
            var series = _this.store.createRecord('series', {
              title: show.title,
              overview: show.overview,
              rating: show.rating,
              image: show.image,
              traktID: show.ids.trakt,
              seasons: seasons,
              status: show.status,
              runtime: show.runtime,
            });
            series.save().then(function() { window.alert("Show added"); });
          });
        });
      }
    }
  }
});
