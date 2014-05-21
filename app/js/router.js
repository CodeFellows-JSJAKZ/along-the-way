var $ = require('jquery');
var LocationModel = require('./models/LocationModel.js');
var LocationView = require('./views/locationView.js');
var LocationList = require('./collections/locationList.js');
var LocationListView = require('./views/locationListView.js');
var Place = require('./models/Place.js');
var Places = require('./collections/Places.js');
var PlacesCollectionView = require('./views/PlacesCollectionView.js');
var Backbone = require('backbone');
Backbone.$ = $;

var Router = Backbone.Router.extend({

  routes: {
    '': 'home',
    '/:location': 'placesList'
  },

  home: function home() {
    // create location list & list view
    var locationList = new LocationList();
    var locationListView = new LocationListView({
      collection: locationList,
      el: $('.location-wrapper')
    });
    locationListView.render();
  },

  placesList: function(location){
    console.log(search);
    var placesList = new Places();
    var placesView = new PlacesView({
      collection: placesList

    });
    placesView.render();
  }
  /* PLACES API CODE
        var places = new Places({location: locObj.id});
        var placesView = new PlacesCollectionView({
          collection: places,
          el: $('#places-list')
        });

        // map prefs
        var map = new google.maps.Map(document.getElementById('map'), {
          center: new google.maps.LatLng(locObj.lat,locObj.lng),
          zoom: 15
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
    */
});

module.exports = Router;
