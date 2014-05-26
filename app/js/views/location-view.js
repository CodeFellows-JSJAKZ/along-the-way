var Backbone = require('backbone');
var $ = require('jquery');
var template = require('./../../templates/location.hbs');

/* View for a single Location object.
 *
 * Handles delete click
 * Handles click to view list of places for location
 */
var LocationView = Backbone.View.extend({

  initialize: function() {
    this.listenTo(this.model, 'change', this.render);
  },

  events: {
    'click .location-remove': 'destroy',
    'click li p': 'showPlaces'
  },

	template: template,

  showPlaces: function(){
    Backbone.history.navigate(this.model.cid, {trigger: true});
    $('#places-wrapper').show();
  },

  destroy: function() {
    this.model.destroy();
    this.remove();
  },

  render: function render () {
		$(this.$el.html(this.template(this.model.toJSON()))).prependTo('#location-list');
    return this;
  }
});

module.exports = LocationView;

