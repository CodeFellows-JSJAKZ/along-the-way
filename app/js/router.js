var $ = require('jquery');
var Location = require('./models/Location.js');
var Place = require('./models/Place.js');
var Places = require('./collections/Places.js');
var PlacesCollectionView = require('./views/PlacesCollectionView.js');
var Backbone = require('backbone');
Backbone.$ = $;

var Router = Backbone.Router.extend({

  routes: {
    'find/:loc': 'getLocation',
    'home': 'viewLocation'
  },

  // get places near a given area
  // takes a user-entered string
  // creates Location, Places collection
  getLocation: function getLocation(locationStr) {
    // map prefs
    var map = new google.maps.Map(document.getElementById('map'), {
      center: new google.maps.LatLng(-33.8665433,151.1956316),
      zoom: 15
    });
    // start geocoding
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address': locationStr}, function geocodeCallback(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        // create Location and empty Places collection
        var loc = results[0].geometry.location;
        console.log(loc);
        var locObj = new Location({search: locationStr, coords: loc});
        var places = new Places({location: locObj.id});
        var placesView = new PlacesCollectionView({
          collection: places,
          el: $('#location-list')
        });
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
              console.log(place);
              places.add(place);
            }
            placesView.render();
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
    console.log('viewLocation');
    return new LocationView({});
  }
});

module.exports = Router;
