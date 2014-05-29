var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var LocationModel = require('./../models/location-model.js');
var template = require('./../../templates/location-collection.hbs');
var googleMapServices = require('./../apis/googleMaps.js');

/* View for a collection of Location objects.
 *   Handles location input.
 */
 var LocationListView = Backbone.View.extend({

  template: template,

  initialize: function() {
    _.bind(this.inputEntered, this);
  },

  events: {
    'click #location-submit': 'inputEntered',
  },

  inputEntered: function() {
    var start = $('#start-input').val().trim();
    var end = $('#destination-input').val().trim();
    if(!end){
      alert('Please add an end location');
    }else if(!start){
      alert('Please add a start point');
    }
    else{
      var filteredArray = [];
      var filter = $('#filter').find('input:checked');
      for(var i=0; i < filter.length; i++){
        var val = filter[i].value;
        console.log(val);
        filteredArray.push(val);
      }
      googleMapServices.filterFunc(filteredArray);
      if (start !== '' && end !== '') {
      // create both location objects and add to collection
        var model = new LocationModel({search: start, order: 0});
        this.collection.add(model);
        model = new LocationModel({search: end, order: 1});
        this.collection.add(model);
        var offset = $('#gmap').offset();
        window.scrollTo(0, offset.top);
      }
    }
  },

  render: function render () {
    this.$el.html(this.template({}));
    return this;
  }
});

module.exports = LocationListView;

