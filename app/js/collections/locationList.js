var Backbone = require('backbone');
var LocationModel = require('../models/LocationModel.js');

var LocationCollection = Backbone.Collection.extend({
  model: LocationModel
})

module.exports = LocationCollection;
