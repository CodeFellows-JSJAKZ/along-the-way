var $ = require('jquery');
var Backbone = require('backbone');
var handlebars = require('handlebars');
var tmpl = require('./../../templates/locationTmpl.hbs');

/* View for a single Location object.
 * Handles delete click
 */
var LocationView = Backbone.View.extend({
  template: tmpl,

  initialize: function() {
    console.log('locationView initialize');
    this.listenTo(this.model, 'change', this.render);
  },

  events: {
    'click .delete': 'destroy',
    'click': 'showPlaces'
  },

  showPlaces: function(){
    console.log(this.model.get('search'));
    Backbone.history.navigate(this.model.get('search'), {trigger: true});
  },

  destroy: function() {
    this.model.destroy();
    this.remove();
  },

  render: function render () {
    console.log('location view render');
    console.log(this.model.toJSON());
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  }
});

module.exports = LocationView;
