var Backbone = require('backbone');
var $ = require('jquery');
var Router = require('./router.js');

global.AlongTheWay = {};

new Router();
$(function(){
  Backbone.history.start();
  Backbone.history.navigate('');
});

