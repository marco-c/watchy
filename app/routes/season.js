import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    return this.get('store').findRecord('series', params.showID).then(function(show) {
      return show.get("seasons").then(function(seasons) {
        var season = seasons.toArray()[params.seasonNumber];
        season.showID = params.showID;
        season.seasonNumber = params.seasonNumber;
        return season;
      });
    });
  }
});
