var Backbone = require('backbone');
var _ = require('underscore');
var template = require('./../../templates/location.hbs');

/* View for a single Location object.
 *
 * Handles delete click
 * Handles click to view list of places for location
 */
var LocationView = Backbone.View.extend({
  template: template,

  initialize: function() {
    this.listenTo(this.model, 'change', this.render);
		_.bind(this.showPlaces, this);
  },

  events: {
    'click .location-remove': 'destroy',
    'click li p': 'showPlaces'

  },

  showPlaces: function(){
    Backbone.history.navigate(this.model.cid, {trigger: true});
  },

  destroy: function() {
    this.model.destroy();
    this.remove();
  },

  render: function render () {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  }
});

module.exports = LocationView;

