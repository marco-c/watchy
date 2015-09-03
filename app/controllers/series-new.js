import Ember from 'ember';

export default Ember.Controller.extend({
  isSearching: false,

  resultCount: 0,
  results: null,

  search: function(query) {
      var _this = this;

      if (this.get('isSearching')) {
          return;
      }

      this.set('isSearching', true);

      return new Promise(function(resolve, reject) {
        var request = new XMLHttpRequest();
        request.responseType = "json";

        request.open('GET', 'https://private-anon-97425823a-trakt.apiary-mock.com/shows/trending');

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
            var request = new XMLHttpRequest();
            request.responseType = "json";

            request.open('GET', 'https://private-anon-97425823a-trakt.apiary-mock.com/search?id_type=trakt&id=' + show.show.ids.trakt);

            request.setRequestHeader('Content-Type', 'application/json');
            request.setRequestHeader('trakt-api-version', '2');
            request.setRequestHeader('trakt-api-key', 'b6ef9e6bad7815daa5d6df6cc236e3b0bf70606483209b404bfa7f7b31133884');

            request.onload = function() {
              console.log(request.response);
              var details = request.response[0].show || request.response[0].movie;
              resolve(details);
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
          if (window.confirm("Add " + show.title + " to your list?")) {
            var series = this.store.createRecord('series', {
              title: show.title,
              overview: show.overview,
              score: 0,
              image: show.images.poster.thumb,
              traktID: show.ids.trakt
            });
            series.save();
          }
      }
  }
});
