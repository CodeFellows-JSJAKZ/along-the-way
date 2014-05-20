var Backbone = require('backbone');
Backbone.$ = require('jquery');
var LocationView = require('./views/LocationView.js');

var Router = Backbone.Router.extend({

  routes: {
    'find/:loc': 'getLocations',
    'home': 'viewLocation'
  },

  // get places near a given area
  // takes a user-entered string
  // creates Location, Places collection
  getLocation: function getLocation(locationStr) {
    var map = new google.maps.Map(document.getElementById('map'), {
      center: new google.maps.LatLng(-33.8665433,151.1956316),
      zoom: 15
    });
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address': locationStr}, function geocodeCallback(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        // create Location and empty Places collection
        var loc = results[0].geometry.location;
        var locObj = new Location({search: locationStr, coords: loc});
        var places = new Places({location: locObj.id});
        // get places
        var service = new google.maps.places.PlacesService(map);
        service.nearbySearch({location: loc, radius: '100'}, function nearbyCallback(results, status) {
          if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
              // create a new Place and add it to Places
              var place = new Place({
                name: results[i].name,
                coords: results[i].geometry.location,
                types: results[i].types,
                rating: results[i].rating,
                address: results[i].vicinity
              });
              places.add(place);
            }
          } else {
            console.log('ERROR: ' + status);
          }
        });
      } else {
        return 'Error: ' + status;
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

