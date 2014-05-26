var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var LocationModel = require('./../models/location-model.js');
var template = require('./../../templates/location-collection.hbs');

/* View for a collection of Location objects.
 *   Handles location input.
 */
var LocationListView = Backbone.View.extend({

  initialize: function() {
    _.bind(this.inputEntered, this);
  },

  el: '#location-wrapper',

	template: template,

  events: {
    'keypress #location-input': 'inputEntered',
    'click #location-submit': 'inputEntered'
  },

  inputEntered: function(ev) {
    // on Enter or submit press, create new LocationModel
    if (ev.type === 'click' || ev.keyCode === 13) {
      var userInput = $('#location-input').val();
      if (userInput.trim() !== '') {
        // clear input
        $('#location-input').val('');
        var model = new LocationModel({
					search: userInput.trim()
        });
        this.collection.add(model);
        // if starting point was entered, change button text
        if (this.collection.length === 1) {
          $('#location-submit').val('Add location');
					$('#location-wrapper .location-form label').text('Enter another location');
        }
      }
    }
  },

  render: function render () {
    this.$el.html(this.template());
    return this;
  }
});

module.exports = LocationListView;

