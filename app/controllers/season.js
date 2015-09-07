import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    mark: function(episode) {
      episode.set("watched", !episode.get("watched"));
      return episode.save();
    }
  }
});
