var Backbone = require('backbone');
var $ = require('jquery');
var PlaceModel = require('../models/Place.js');
var Along = require('./../app.js');

var Places = Backbone.Collection.extend({
	model: PlaceModel,
	initialize: function(location){
		this.location = location;

		var coords = new google.maps.LatLng(location.get('lat'), location.get('lng'));
		var map = new google.maps.Map(document.getElementById('map'),{
		  center: coords,
		  zoom: 15
		});

    // get places
    var service = new google.maps.places.PlacesService(map);
    var that = this;
    service.nearbySearch({location: coords, radius: '100'},
      function nearbyCallback(results, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          // create a new Place and add it to Places
          var place = new PlaceModel({
            name: results[i].name,
            lat: results[i].geometry.location.lat(),
            lng: results[i].geometry.location.lng(),
            types: results[i].types,
            rating: results[i].rating,
            address: results[i].vicinity
          });
          that.add(place);
        }
      } else {
        console.log('ERROR: ' + status);
      }
    });
    
  }
});

module.exports = Places;
	
