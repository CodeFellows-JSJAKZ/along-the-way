var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;

var LocationCollection = require('./collections/location-collection.js');
var LocationCollectionView = require('./views/location-collection-view.js');
var PlaceCollection = require('./collections/place-collection.js');
var PlaceCollectionView = require('./views/place-collection-view.js');
var PlaceDetailedView = require('./views/place-detailed-view.js');
var googleMapServices = require('./apis/googleMaps.js');

var Router = Backbone.Router.extend({

  routes: {
    '': 'home',
    ':locationId': 'placesList',
    ':locationId/:placeId': 'placeDetails'
  },

  home: function home() {
    // create location list & list view
    var locationCollection = new LocationCollection();
    var locationCollectionView = new LocationCollectionView({
      collection: locationCollection,
      el: $('.location-wrapper')
    });
    locationCollectionView.render();

    // try to locate user and initialize google maps services
    if ("geolocation" in navigator) {
      console.log('Trying to get location');
      navigator.geolocation.getCurrentPosition(googleMapServices.initialize);
    } else {
      console.log('Geolocation not supported by browser.');
      googleMapServices.initialize(null);
    }
  },

  placesList: function(locationId){
    var placeCollectionView = new PlaceCollectionView({
			collection: AlongTheWay[locationId],
      el: $('#places-list')
    });
    placeCollectionView.render();
  },

  placeDetails: function(locationId, placeId) {
    var placeDetailedView = new PlaceDetailedView({
      model: AlongTheWay[locationId].get(placeId),
      el: $('.wrapper')
    });
    placeDetailedView.render();
  }
});

module.exports = Router;

