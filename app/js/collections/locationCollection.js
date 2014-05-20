var Backbone = require('backbone');
var LocationModel = require('../models/Location.js');

var LocationCollection = Backbone.Collection.extend({
  model: LocationModel,

})
