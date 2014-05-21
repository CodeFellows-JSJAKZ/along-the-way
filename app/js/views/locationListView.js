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

	el: '',

  template: tmpl,

  initialize: function() {
    console.log('colview initialize');
    this.listenTo(this.collection, 'add', this.modelAdded);
    _.bind(this.inputEntered, this);
    _.bind(this.modelAdded, this);
  },

  events: {
    'keypress #location-input': 'inputEntered',
    'click #location-submit': 'inputEntered'
  },

  inputEntered: function(ev) {
    // on Enter or submit press, trigger a submit
    if (ev.type == 'click' || ev.keyCode == 13) {
      var userInput = $('#location-input').val();
      if (userInput.trim() != '') {
        console.log('input entered', userInput);
        var model = new LocationModel({search: userInput});
        console.log('Adding model to collection');
        this.collection.add(model);
      }
    }
  },

  modelAdded: function(location) {
    console.log('modelAdded');
    console.log(location);
    var view = new LocationView({model: location});
    $('#location-list').append(view.render().el);
  },

  render: function render () {
    this.$el.html(this.template({}));
    return this;
  }
});

module.exports = LocationListView;

