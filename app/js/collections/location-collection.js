var Backbone = require('backbone');
var LocationModel = require('../models/location-model.js');

var LocationCollection = Backbone.Collection.extend({
  model: LocationModel
});

module.exports = LocationCollection;

