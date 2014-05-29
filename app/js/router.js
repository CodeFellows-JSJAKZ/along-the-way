var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;

var LocationCollection = require('./collections/location-collection.js');
var LocationCollectionView = require('./views/location-collection-view.js');
var PlaceDetailedView = require('./views/place-detailed-view.js');
var googleMapServices = require('./apis/googleMaps.js');

global.AlongTheWay = {};

var Router = Backbone.Router.extend({

  // views to cache
  locationCollectionView: null,

  initialize: function() {
    AlongTheWay.router = this;
    _.bind(this.home, this);
  },

  routes: {
    '': 'home'
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
      if ('geolocation' in navigator) {
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
  }
});

new Router();
Backbone.history.start();

