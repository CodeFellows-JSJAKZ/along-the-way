var PlaceModel = require('./../models/place-model.js');
var $ = require('jquery');
var _ = require('underscore');

var googleMapServices = {

  // define object properties that are set later
  coords: null,
  map: null,
  placesService: null,
  geocoder: null,

  // types:[] to search for when returning places
  // see https://developers.google.com/places/documentation/supported_types
  filter: {
    entertainment: ['amusement_park', 'aquarium', 'art_gallery',
    'bowling_alley', 'casino', 'movie_rental', 'movie_theater',
    'stadium', 'museum', 'night_club', 'park','zoo'],
    stores: ['bicycle_store', 'book_store', 'clothing_store', 'convenience_store',
    'department_store', 'electronics_store', 'home_goods_store', 'jewelry_store',
    'liquor_store', 'hardware_store', 'store', 'shoe_store', 'shopping_mall',
    'pet_store', 'grocery_or_supermarket', 'florist'],
    services: ['car_repair', 'car_wash', 'gas_station', 'laundry'],
    food: ['bakery', 'bar', 'cafe', 'food', 'meal_delivery',
    'meal_takeaway', 'restaurant'],
    aesthetics: ['beauty_salon', 'gym', 'hair_care', 'spa'],
    transportation: ['bus_station', 'subway_station', 'taxi_stand', 'train_station'],
    banking: ['atm', 'bank', 'post_office'],
    education: ['school', 'university', 'library']
  },

  filterFunc: function filterFunc(checked){
    var finalFilter = [];
    for(var i=0; i < checked.length; i++){
      finalFilter.push(this.filter[checked[i]]);
    }
    console.log('filterfunc call: '+ finalFilter);
    this.buildRoute(null, finalFilter);

  },

  /* Set up maps services */
  initialize: function initialize(geoposition) {
    if (geoposition) {
      googleMapServices.createMap(geoposition.coords);
      this.geocoder = this.geocoder || new google.maps.Geocoder();
      var latlng = new google.maps.LatLng(geoposition.coords.latitude, geoposition.coords.longitude);
      this.geocoder.geocode({'latLng': latlng}, function (results, status) {
        $('#start-input').val(results[0].formatted_address);
      });
    } else {
      googleMapServices.createMap({lat: 0, lng: 0});
    }
    googleMapServices.initializeAutoComplete();
  },

  /* create map to be used by all google maps services */
  createMap: function createMap(coords) {
    this.coords = new google.maps.LatLng(coords.latitude, coords.longitude);
    this.map = new google.maps.Map(document.getElementById('gmap'),{
      center: this.coords,
      zoom: 15
    });
    this.placesService = new google.maps.places.PlacesService(this.map);
    //this.startMarker = new google.maps.Marker({map: this.map, position: this.coords, visible: true});
  },

  /* Set up autocomplete to work when entering locations.
   * coords: google.maps.LatLng object
   */
   initializeAutoComplete: function initializeAutoComplete() {
    var startInput = (document.getElementById('start-input'));
    var destInput = (document.getElementById('destination-input'));
    var autocomplete = new google.maps.places.Autocomplete(startInput);
    var autocomplete2 = new google.maps.places.Autocomplete(destInput);
    autocomplete.bindTo('bounds', this.map);
    autocomplete2.bindTo('bounds', this.map);
  },

  geocodeLocation: function geocodeLocation(location, cb) {
    // get or create geocoder
    this.geocoder = this.geocoder || new google.maps.Geocoder();

    this.geocoder.geocode({'address': location.get('search')},
      function(results, status) {
        var coords = null;
        var error = null;
        if (status == google.maps.GeocoderStatus.OK) {
          console.log(results);
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
    var opts = {
      location: new google.maps.LatLng(location.get('lat'), location.get('lng')),
      radius: '100',
      types: that.placeTypes
    }
    this.placesService.nearbySearch(opts, function nearbyCallback(results, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          // create a new Place and add it to Places
          var place = new PlaceModel({
            name: results[i].name,
            lat: results[i].geometry.location.lat(),
            lng: results[i].geometry.location.lng(),
            types: results[i].placeTypes,  
            rating: results[i].rating,
            address: results[i].vicinity
          });
          collection.add(place);
        }
      } else {
        console.log('ERROR: ' + status);
      }
    });
  },

  /* Receive geocoded start or end point. */
  buildRoute: function buildRoute(location, placeTypes) {
   if (placeTypes) {
    this.placeTypes = placeTypes;
  } else if (location) {
    if (location.get('order') == 0) {
      this.start = location
      } else { // assuming only 2
        this.end = location
      }
    }
    if (this.start && this.end && this.placeTypes) {
      this.getDirections(this.start, this.end);
    }
  },

  getDirections: function getDirections(start, end) {
    var startLL = new google.maps.LatLng(start.get('lat'), start.get('lng'));
    var endLL = new google.maps.LatLng(end.get('lat'), end.get('lng'));
    this.directionsService = this.directionService || new google.maps.DirectionsService()
    var directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(this.map);

    var opts = {
      origin: startLL,
      destination: endLL,
      travelMode: google.maps.TravelMode.DRIVING
    };

    this.directionsService.route(opts, function(result, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(result);
      } else {
        console.warn(status);
        return;
      }
    });
  }

}

global.googlemapsZ = googleMapServices;
module.exports = googleMapServices;

