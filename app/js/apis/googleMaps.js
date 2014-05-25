var PlaceModel = require('./../models/place-model.js');

var googleMapServices = {
  
  service: null,
  coords: null,
  map: null,
  placesService: null,

  /* Get geolocation of user using HTML5 */
  getGeoLocation: function getGeoLocation() {
    if ("geolocation" in navigator) {
      console.log('Trying to get location');
      var that = this;
      navigator.geolocation.getCurrentPosition(function(geoposition) {
        console.log('Received coords');
        console.log(geoposition.coords);
        that.createMap(geoposition.coords);
        that.initializeAutoComplete();
      });
    } else {
      console.warn("Geolocation is not supported by this browser.");
      this.createMap({lat: 0, lng: 0});
    }
  },

  /* create map to be used by all google maps services */
  createMap: function createMap(coords) {
    console.log('creating a map at ' + coords);
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
    console.log("initializeAutoComplete!!!!");
    var input = (document.getElementById('location-input'));
    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', this.map);
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
          // console.dir(place)
          collection.add(place);
        }
      } else {
        console.log('ERROR: ' + status);
      }
    });
  }

}

module.exports = googleMapServices;

