import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    return this.get('store').findRecord('series', params.showID).then(function(show) {
      return show.get("seasons").then(function(seasons) {
        return seasons.toArray()[params.seasonNumber].get("episodes").then(function(episodes) {
          return episodes.toArray()[params.episodeNumber];
        });
      });
    });
  }
});
