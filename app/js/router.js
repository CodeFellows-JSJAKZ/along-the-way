var $ = require('jquery');
var LocationList = require('./collections/locationList.js');
var LocationListView = require('./views/locationListView.js');
var Places = require('./collections/Places.js');
var PlacesView = require('./views/PlacesView.js');
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
