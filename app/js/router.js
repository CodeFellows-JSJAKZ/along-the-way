var Backbone = require('backbone');
Backbone.$ = require('jquery');
var LocationView = require('./views/LocationView.js');

var Router = Backbone.Router.extend({

  routes: {
    'find/:loc': 'getLocations',
    'home': 'viewLocation'
  },

  getLocations: function(loc) {
    alert('getLocations');
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address': loc}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        console.log(results[0].geometry.location);
      } else {
        console.log('Error: ' + status);
      }
    });
  },

  viewLocation: function () {
    return new LocationView({});
  }
});

//var appRouter =
new Router();
Backbone.history.start();

