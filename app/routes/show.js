import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    return this.get('store').findRecord('series', params.showID).then(function(show) {
      return show.get('seasons').then(function(seasons) {
        var promises = [];

        // Sort by season number (with the special season at the end).
        seasons = seasons.toArray().sort(function(a, b) {
          if (a.get('number') === 0) {
            return 1;
          }

          if (b.get('number') === 0) {
            return -1;
          }

          return a.get('number') - b.get('number');
        });

        seasons.forEach(function(season) {
          if (season.get('number') === 0) {
            season.computedName = 'Specials';
          } else {
            season.computedName = 'Season ' + season.get('number');
          }

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
          show.computedSeasons = seasons;
          return show;
        });
      });
    });
  }
});
