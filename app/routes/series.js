import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    var _this = this;
    return new Promise(function(resolve, reject) {
      _this.get('store').findAll('series').then(function(shows) {
        var promises = [];

        shows.forEach(function(show) {
          promises.push(new Promise(function(resolve, reject) {
            show.get("seasons").then(function(seasons) {
              var episodePromises = [];

              seasons.forEach(function(season) {
                episodePromises.push(season.get("episodes").then(function(episodes) {
                  return episodes.find(function(episode) {
                    return episode.get("watched") === false;
                  });
                }));
              });

              Promise.all(episodePromises).then(function(episodes) {
                var episode = episodes.find(episode => episode);
                show.nextEpisodeNumber = episode.get("number");
                show.nextEpisodeTitle = episode.get("title");
                show.nextEpisodeDate = episode.get("date");
                resolve(show);
              });
            });
          }));
        });

        Promise.all(promises).then(resolve);
      });

    });
  }
});
