var Backbone = require('backbone');
var Place = require('../models/Place.js');

var Places = Backbone.Collection.extend({
  model: Place
});

module.exports = Places;

