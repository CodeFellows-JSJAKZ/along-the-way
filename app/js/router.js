var $ = require('jquery');
var LocationCollection = require('./collections/location-collection.js');
var LocationCollectionView = require('./views/location-collection-view.js');
var PlaceCollection = require('./collections/place-collection.js');
var PlaceCollectionView = require('./views/place-collection-view.js');
var Backbone = require('backbone');
Backbone.$ = $;


var Router = Backbone.Router.extend({

  routes: {
    '': 'home',
    ':locationId': 'placesList'
  },

  home: function home() {
    // create location list & list view
    var locationCollection = new LocationCollection();
    var locationCollectionView = new LocationCollectionView({
      collection: locationCollection,
      el: $('.location-wrapper')
    });
    locationCollectionView.render();

  },

  placesList: function(locationId){
    var placeCollectionView = new PlaceCollectionView({
			collection: AlongTheWay[locationId],
      el: $('#places-list')
    });
    placeCollectionView.render();
  }

});

module.exports = Router;

