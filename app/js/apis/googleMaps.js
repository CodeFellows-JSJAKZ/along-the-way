var PlaceModel = require('./../models/place-model.js');

var googleMapServices = {
  
  // define object properties that are set later
  coords: null,
  map: null,
  placesService: null,
  geocoder: null,

  /* Set up maps services */
  initialize: function initialize(geoposition) {
    console.log(this);
    if (geoposition) {
      console.log('Received coords');
      console.log(geoposition.coords);
      googleMapServices.createMap(geoposition.coords);
      googleMapServices.initializeAutoComplete();
    } else {
      googleMapServices.createMap({lat: 0, lng: 0});
    }
  },

  /* create map to be used by all google maps services */
  createMap: function createMap(coords) {
		this.coords = new google.maps.LatLng(coords.latitude, coords.longitude);
		this.map = new google.maps.Map(document.getElementById('map'),{
		  center: this.coords,
		  zoom: 15
    });
    this.placesService = new google.maps.places.PlacesService(map);
  },

  /* Set up autocomplete to work when entering locations.
   * coords: google.maps.LatLng object
   */
  initializeAutoComplete: function initializeAutoComplete() {
    var input = (document.getElementById('location-input'));
    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', this.map);
  },

  geocodeLocation: function geocodeLocation(location, cb) {
    // get or create geocoder
    this.geocoder = this.geocoder || new google.maps.Geocoder();
                      
    this.geocoder.geocode({'address': location.get('search')},
      function(results, status) {
        var coords = null;
        var error = null;
        if (status == google.maps.GeocoderStatus.OK) {
          coords = results[0].geometry.location;
        } else {
          error = status;
        }
        cb(location, coords, error);
      });
  },

  getPlacesByLocation: function getPlacesByLocation(location, collection) {
    // get places
    var that = this;
    var locationCoords = new google.maps.LatLng(location.get('lat'), location.get('lng'));
    this.placesService.nearbySearch({location: locationCoords, radius: '100'},
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
          collection.add(place);
        }
      } else {
        console.log('ERROR: ' + status);
      }
    });
  }

}

module.exports = googleMapServices;

