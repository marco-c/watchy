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
                // We don't want to show special episodes in the show list.
                if (season.get('number') === 0) {
                  return;
                }

                episodePromises.push(season.get("episodes").then(function(episodes) {
                  return episodes.find(function(episode) {
                    if (episode.get("watched") === false) {
                      episode.seasonNumber = season.get("number");
                      return true;
                    } else {
                      return false;
                    }
                  });
                }));
              });

              Promise.all(episodePromises).then(function(episodes) {
                var episode = episodes.find(episode => episode);
                if (episode) {
                  show.nextEpisodeText = episode.seasonNumber + "x" + episode.get("number") + " - " + episode.get("title");
                  show.nextEpisodeDate = episode.get("aired_date");
                } else {
                  show.nextEpisodeText = show.get("status");
                  show.nextEpisodeDate = "";
                }
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
