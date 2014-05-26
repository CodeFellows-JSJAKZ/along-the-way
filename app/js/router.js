var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;

var LocationCollection = require('./collections/location-collection.js');
var LocationCollectionView = require('./views/location-collection-view.js');
var PlaceCollection = require('./collections/place-collection.js');
var PlaceCollectionView = require('./views/place-collection-view.js');
var PlaceDetailedView = require('./views/place-detailed-view.js');
var googleMapServices = require('./apis/googleMaps.js');

global.AlongTheWay = {};

var Router = Backbone.Router.extend({

  // views to cache
  locationCollectionView: null,

  initialize: function(opts) {
    AlongTheWay.router = this;
    _.bind(this.home, this);
    _.bind(this.placesList, this);
    _.bind(this.placeDetails, this);
  },

  routes: {
    '': 'home',
    ':locationId': 'placesList',
    ':locationId/:placeId': 'placeDetails'
  },

  home: function home() {
    // create location list & list view
    if (!this.locationCollectionView) {
      var locationCollection = new LocationCollection();
      this.locationCollectionView = new LocationCollectionView({
        collection: locationCollection,
        el: $('#inner-wrapper')
      });
      // try to locate user and initialize google maps services
      if ("geolocation" in navigator) {
        console.log('Geolocating..');
        navigator.geolocation.getCurrentPosition(function(geoposition) {
          googleMapServices.initialize(geoposition);
        });
      } else {
        console.log('Geolocation not supported by browser.');
        googleMapServices.initialize(null);
      }
    }
    this.locationCollectionView.render();
  },

  placesList: function(locationId){
    var placeCollectionView = new PlaceCollectionView({
			collection: AlongTheWay[locationId],
      el: $('#inner-wrapper')
    });
    // hacky - may want to replace
    var locationObj = this.locationCollectionView.collection.get({cid: locationId})
    placeCollectionView.render(locationObj.get('search'));
  },

  placeDetails: function(locationId, placeId) {
    var placeDetailedView = new PlaceDetailedView({
      model: AlongTheWay[locationId].get(placeId),
      el: $('#inner-wrapper')
    });
    placeDetailedView.render();
    // set url on back button
    $('.back-button').attr('href', '#' + locationId);
  }
});

new Router();
Backbone.history.start();

