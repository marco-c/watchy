import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    mark: function(episode) {
      episode.set("watched", true);
      return episode.save();
    }
  }
});
