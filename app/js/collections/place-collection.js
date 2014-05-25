var Backbone = require('backbone');
var $ = require('jquery');
var PlaceModel = require('../models/place-model.js');
var googleMapServices = require('./../apis/googleMaps.js');

var PlaceCollection = Backbone.Collection.extend({

	model: PlaceModel,

	initialize: function(location){
    googleMapServices.getPlacesByLocation(location, this);
  }
});

module.exports = PlaceCollection;

