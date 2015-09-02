import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return new Promise(function(resolve, reject) {
      var request = new XMLHttpRequest();

      request.open('GET', 'https://private-anon-97425823a-trakt.apiary-mock.com/shows/trending');

      request.setRequestHeader('Content-Type', 'application/json');
      request.setRequestHeader('trakt-api-version', '2');
      request.setRequestHeader('trakt-api-key', Ember.TRAKT_API_KEY);

      request.onreadystatechange = function () {
        if (this.readyState === 4) {
          console.log('Status:', this.status);
          console.log('Headers:', this.getAllResponseHeaders());
          console.log('Body:', this.responseText);
          resolve(JSON.parse(this.responseText));
        }
      };

      request.send();
    }).then(function(shows) {
      return Promise.all(shows.map(function(show) {
        return new Promise(function(resolve, reject) {
          var request = new XMLHttpRequest();

          request.open('GET', 'https://private-anon-97425823a-trakt.apiary-mock.com/search?id_type=trakt&id=' + show.show.ids.trakt);

          request.setRequestHeader('Content-Type', 'application/json');
          request.setRequestHeader('trakt-api-version', '2');
          request.setRequestHeader('trakt-api-key', 'b6ef9e6bad7815daa5d6df6cc236e3b0bf70606483209b404bfa7f7b31133884');

          request.onreadystatechange = function () {
            if (this.readyState === 4) {
              console.log('Body:', this.responseText);
              var details = JSON.parse(this.responseText)[0];
              resolve(details.show || details.movie);
            }
          };

          request.send();
        });
      }));
    });
  }
});
