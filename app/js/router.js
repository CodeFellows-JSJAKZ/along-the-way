var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;

var LocationCollection = require('./collections/location-collection.js');
var LocationCollectionView = require('./views/location-collection-view.js');
var PlaceCollectionView = require('./views/place-collection-view.js');
var PlaceDetailedView = require('./views/place-detailed-view.js');

var Router = Backbone.Router.extend({

  routes: {
    '': 'home',
    ':locationId': 'placesList',
    ':locationId/:placeId': 'placeDetails'
  },

  home: function home() {

    // create location list & list view
    var locationCollectionView = new LocationCollectionView({
      collection: new LocationCollection()
    });
		locationCollectionView.render();

  },

  placesList: function(locationId){

		if (AlongTheWay[locationId] === undefined) {
			Backbone.history.navigate('');
			return false;
		}

		$('#location-wrapper').hide();
		$('#places-wrapper').show();

    var placeCollectionView = new PlaceCollectionView({
			collection: AlongTheWay[locationId]
    });
		placeCollectionView.render();

  },

  placeDetails: function(locationId, placeId) {

		$('#places-wrapper').hide();

    var placeDetailedView = new PlaceDetailedView({
      model: AlongTheWay[locationId].get(placeId)
    });
		placeDetailedView.render();

  }
});

module.exports = Router;

