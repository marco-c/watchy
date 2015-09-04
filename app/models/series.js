import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  overview: DS.attr('string'),
  score: DS.attr('number'),
  image: DS.attr('string'), // create a new 'image' DS.Transform
  traktID: DS.attr('number'),
  seasons: DS.hasMany('season', { async: true }),
});
