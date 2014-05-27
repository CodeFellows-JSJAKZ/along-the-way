var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var LocationView = require('./location-view.js');
var LocationModel = require('./../models/location-model.js');
var template = require('./../../templates/location-collection.hbs');

/* View for a collection of Location objects.
 *   Handles location input.
 */
var LocationListView = Backbone.View.extend({

  template: template,

  initialize: function() {
    // listen for models being added to collection
    this.listenTo(this.collection, 'add', this.modelAdded);
    _.bind(this.inputEntered, this);
  },

  events: {
    'click #location-submit': 'inputEntered',
  },

  inputEntered: function(ev) {
    // on Enter or submit press, create new LocationModel
    var start = $('#start-input').val().trim();
    var end = $('#destination-input').val().trim();
    if (start !== '' && end !== '') {
      // create both location objects and add to collection
      var model = new LocationModel({search: start, order: 0});
      this.collection.add(model);
      model = new LocationModel({search: end, order: 1});
      this.collection.add(model);
    }
  },

  render: function render () {
    this.$el.html(this.template({}));
    return this;
  }
});

module.exports = LocationListView;

