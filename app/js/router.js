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
    ':location': 'placesList'
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
    var placesList = Along[location];
    var placesView = new PlacesView({
      collection: placesList,
      el: '#places-list'
    });
    placesView.render();
  }

});

module.exports = Router;
