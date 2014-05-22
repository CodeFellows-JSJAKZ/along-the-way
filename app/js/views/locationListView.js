var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var tmpl = require('./../../templates/locationCollectionTemplate.hbs');
var LocationView = require('./locationView.js');
var LocationModel = require('./../models/LocationModel.js');

/* View for a list of Location objects.
 *   Handles location input.
 */
var LocationListView = Backbone.View.extend({

  template: tmpl,

  initialize: function() {
    console.log('colview initialize');
    // listen for models being added to collection
    this.listenTo(this.collection, 'add', this.modelAdded);
    _.bind(this.inputEntered, this);
    _.bind(this.modelAdded, this);
  },

  events: {
    'keypress #location-input': 'inputEntered',
    'click #location-submit': 'inputEntered'
  },

  inputEntered: function(ev) {
    // on Enter or submit press, create new LocationModel
    if (ev.type == 'click' || ev.keyCode == 13) {
      var userInput = $('#location-input').val();
      if (userInput.trim() != '') {
        console.log('input entered', userInput);
        // clear input
        $('#location-input').val('');
        var model = new LocationModel({search: userInput.trim()});
        console.log('Adding LocationModel to collection');
        this.collection.add(model);
        // if starting point was entered, change button text
        if (this.collection.length === 1) {
          $('#location-submit').val('Add location');
        }
      }
    }
  },

  modelAdded: function(location) {
    var view = new LocationView({model: location});
    $('#location-list').prepend(view.render().el);
  },

  render: function render () {
    this.$el.html(this.template({}));
    return this;
  }
});

module.exports = LocationListView;

