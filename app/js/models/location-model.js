var Backbone = require('backbone');
var Places = require('./../collections/place-collection.js');
var LocationView = require('../views/location-view.js');
var geocoder = new google.maps.Geocoder();

/* Locations will be passed in with:
 *    search: {String} the string that the user entered
 *    lat: {Number} latitude
 *    lng: {Number} longitude
 */
var LocationModel = Backbone.Model.extend({
  initialize: function() {
    var that = this;
    // geocode
    geocoder.geocode({
			'address': that.get('search')
    }, function geocodeCallback(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        var loc = results[0].geometry.location;

        that.set({lat: loc.lat(), lng: loc.lng()});
        var placesCollection = new Places(that);
				AlongTheWay[that.cid] = placesCollection;
				var view = new LocationView({
					model: that
				});
				view.render();
      } else {
        that.set({error: status});
      }
    });
    console.log('location model ATW global');
    console.dir(AlongTheWay);

  }
});

module.exports = LocationModel;

