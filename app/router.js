import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('series');
  this.route('series-new');
  this.route('show');
  this.route('season');
  this.route('episode');
});

export default Router;
