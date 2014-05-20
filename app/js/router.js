var Backbone = require('backbone');
Backbone.$ = require('jquery');

var Router = Backbone.Router.extend({

  routes: {
    'find/:loc': 'getLocations'
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
  }

});

//var appRouter =
new Router();
Backbone.history.start();

