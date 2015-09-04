import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('series');
  this.route('series-new');
  this.route('show', {path: '/show/:showID'});
  this.route('season', {path: '/season/:showID/:seasonNumber'});
  this.route('episode', {path: '/season/:showID/:seasonNumber/:episodeNumber'});
});

export default Router;
