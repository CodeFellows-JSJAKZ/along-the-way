var Backbone = require('backbone');
var googleMapServices = require('./../apis/googleMaps.js');

/* Locations will be passed in with:
 *    search: {String} the string that the user entered
 *    lat: {Number} latitude
 *    lng: {Number} longitude
 */
var LocationModel = Backbone.Model.extend({

  initialize: function() {
    // geocode
    var that = this;
    googleMapServices.geocodeLocation(that, that.processCoords);
  },

  /* Set coords or error status based on geocoding results */
  processCoords: function processCoords(that, coords, err) {
    // that = this
    if (err) {
      that.set({error: status});
    } else {
      that.set({lat: coords.lat(), lng: coords.lng()});
      googleMapServices.collectRouteComponents(that);
    }
  }
});

module.exports = LocationModel;

