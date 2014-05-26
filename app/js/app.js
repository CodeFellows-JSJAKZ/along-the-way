var Backbone = require('backbone');
var $ = require('jquery');
var Router = require('./router.js');

// global object to help us get places by location
global.AlongTheWay = {};

new Router();

$(function(){
  Backbone.history.start();
});

