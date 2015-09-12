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
        });
      }
    }
  }
});
