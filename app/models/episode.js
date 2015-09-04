import DS from 'ember-data';

export default DS.Model.extend({
  number: DS.attr('number'),
  title: DS.attr('string'),
  watched: DS.attr('boolean', { defaultValue: false }),
});
