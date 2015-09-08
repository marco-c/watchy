import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    return this.get('store').findRecord('series', params.showID).then(function(show) {
      return show.get('seasons').then(function(seasons) {
        var promises = [];

        seasons.forEach(function(season) {
          var episodesWatched = 0;

          promises.push(season.get("episodes").then(function(episodes) {
            episodes.forEach(function(episode) {
              if (episode.get("watched")) {
                episodesWatched++;
              }
            });

            season.set('episodesNum', episodes.get("length"));
            season.set('episodesWatched', episodesWatched);
          }));
        });

        return Promise.all(promises).then(function() {
          show.showID = params.showID;
          return show;
        });
      });
    });
  }
});
