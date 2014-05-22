var Backbone = require('backbone');
var tmpl = require('./../../templates/locationTmpl.hbs');

/* View for a single Location object.
 * Handles delete click
 */
var LocationView = Backbone.View.extend({
  template: tmpl,

  initialize: function() {
    this.listenTo(this.model, 'change', this.render);
  },

  events: {
    'click .location-remove': 'destroy',
    'click li p': 'showPlaces'

  },

  showPlaces: function(){
    Backbone.history.navigate(this.model.get('search'), {trigger: true});

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
