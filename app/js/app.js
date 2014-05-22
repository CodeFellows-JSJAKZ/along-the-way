var Backbone = require('backbone');
var $ = require('jquery');
var Router = require('./router.js');

var Place = require('./models/Place.js');
var PlaceView = require('./views/PlaceView.js');

var Places = require('./collections/Places.js');
var PlacesView = require('./views/PlacesView.js');

var Along = Along || {};

var router = new Router();
$(function(){
  Backbone.history.start();
  Backbone.history.navigate('');
});
