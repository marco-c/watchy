import DS from 'ember-data';

export default DS.Model.extend({
  number: DS.attr('number'),
  episodes: DS.hasMany('episode', { async: true }),
});
