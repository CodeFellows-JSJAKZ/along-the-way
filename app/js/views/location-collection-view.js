var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var LocationView = require('./location-view.js');
var LocationModel = require('./../models/location-model.js');
var template = require('./../../templates/location-collection.hbs');
var googleMapServices = require('./../apis/googleMaps.js');

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

    var start = $('#start-input').val().trim();
    var end = $('#destination-input').val().trim();
    if(!end){
      alert("Please add an end location");
    }else{
      var filteredArray = [];
      var filter = $('#filter').find('input:checked');
      for(var i=0; i < filter.length; i++){
        var val = filter[i].value;
        filteredArray.push(val);
      }
      console.log(filteredArray);
      googleMapServices.filterFunc(filteredArray);
      if (start !== '' && end !== '') {
      // create both location objects and add to collection
      var model = new LocationModel({search: start, order: 0});
      this.collection.add(model);
      model = new LocationModel({search: end, order: 1});
      this.collection.add(model);
    }
  }
},

render: function render () {
  this.$el.html(this.template({}));
  return this;
}
});

module.exports = LocationListView;

