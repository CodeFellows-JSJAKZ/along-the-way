var Backbone = require('backbone');
var $ = require('jquery');
var Router = require('./router.js');

var Place = require('./models/Place.js');
var PlaceView = require('./views/PlaceView.js');

var Places = require('./collections/Places.js');
var PlacesView = require('./views/PlacesView.js');

var place1 = new Place({
	name: 'A Place 1'
});
var place2 = new Place({
	name: 'A Place 2'
});
var place3 = new Place({
	name: 'A Place 3'
});
var place4 = new Place({
	name: 'A Place 4'
});


// Single place page
var placeView = new PlaceView({
	model: place1
});

placeView.render();

/*
// List view
var places = new Places();
places.reset([place1, place2, place3, place4]);

var placesView = new PlacesView({collection: places});

placesView.render();
*/

var router = new Router();
$(function(){
  Backbone.history.start();
  Backbone.history.navigate('');
});
