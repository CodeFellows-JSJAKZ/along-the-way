var Backbone = require('backbone');
var PlaceModel = require('../models/Place.js');

var Places = Backbone.Collection.extend({
	model: PlaceModel
});

module.exports = Places;

