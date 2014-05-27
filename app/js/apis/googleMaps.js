var PlaceModel = require('./../models/place-model.js');
var $ = require('jquery');
var template = require('./../../templates/place-detailed.hbs');

var googleMapServices = {

  // define object properties that are set later
  map: null,
  placesService: null,
  geocoder: null,
  routeBoxer: new RouteBoxer(),

  // types to search for when returning places
  // see https://developers.google.com/places/documentation/supported_types
  types: [
    'amusement_park',
    'aquarium',
    'art_gallery',
    'bakery',
    'bar',
    'beauty_salon',
    'bicycle_store',
    'book_store',
    'bowling_alley',
    'cafe',
    'casino',
    'church',
    'clothing_store',
    'department_store',
    'electronics_store',
    'establishment',
    'florist',
    'food',
    'grocery_or_supermarket',
    'gym',
    'hair_care',
    'hardware_store',
    'health',
    'hindu_temple',
    'home_goods_store',
    'jewelry_store',
    'library',
    'liquor_store',
    'meal_takeaway',
    'mosque',
    'movie_rental',
    'movie_theater',
    'museum',
    'night_club',
    'park',
    'pet_store',
    'pharmacy',
    'physiotherapist',
    'place_of_worship',
    'post_office',
    'restaurant',
    'shoe_store',
    'shopping_mall',
    'spa',
    'stadium',
    'store',
    'synagogue',
    'zoo',
  ],

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
		var coords = new google.maps.LatLng(coords.latitude, coords.longitude);
		this.map = new google.maps.Map(document.getElementById('gmap'),{
		  center: coords,
		  zoom: 15
    });
    this.placesService = new google.maps.places.PlacesService(this.map);
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
          coords = results[0].geometry.location;
        } else {
          error = status;
        }
        cb(location, coords, error);
      });
  },

  /* Receive geocoded start or end point. */
  buildRoute: function(location, placeTypes) {
    if (placeTypes) {
      this.placeTypes = placeTypes;
    } else if (location) {
      if (location.get('order') == 0) {
        this.start = location
      } else { // assuming only 2
        this.end = location
      }
    }
    if (this.start && this.end) {//&& this.placeTypes) {
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

    var that = this;
    this.directionsService.route(opts, function(result, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(result);
        that.createRouteBoxes(result.routes[0].overview_path);
      } else {
        console.warn(status);
        return;
      }
    });
  },

  /* creates LatLngBounds that cover the entire route and can be used in nearbySeach */
  createRouteBoxes: function(overview_path) {
    var boxes = this.routeBoxer.box(overview_path, 1);
    // show boxes on map (for devel)
    var rectangleOpts = {
      strokeColor: '#000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      map: this.map,
    };
    // find places in each box
    for (var i = 0; i < boxes.length; i++) {
      //rectangleOpts.bounds = boxes[i];
      //new google.maps.Rectangle(rectangleOpts);
      this.getNearbyPlaces(boxes[i]);
    }
  },

  getNearbyPlaces: function getNearbyPlaces(latLngBounds) {
    console.log('getNearbyPlaces');
    var that = this;
    var opts = {
      bounds: latLngBounds,
      types: that.types
    }
    this.placesService.nearbySearch(opts, function(results, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        that.putPlacesOnMap(0, results);
          /*
          var place = new PlaceModel({
            name: results[i].name,
            lat: results[i].geometry.location.lat(),
            lng: results[i].geometry.location.lng(),
            types: results[i].types,
            rating: results[i].rating,
            address: results[i].vicinity
          });
          collection.add(place);
          */
      } else {
        console.log('ERROR: ' + status);
      }
    }, this);
  },

  putPlacesOnMap: function(i, results) {
    console.log(this);
    if (i >= results.length) {
      return false;
    }
    var result = results[i];
    var marker = new google.maps.Marker({
      position: result.geometry.location,
      map: this.map,
      visible: true
    });
    var placeContent = template({
        name: result.name,
        rating: result.rating,
        address: result.vicinity
    });
    marker.info = new google.maps.InfoWindow({
      content: placeContent
    });
    google.maps.event.addListener(marker, 'click', function() {
      marker.info.open(this.map, marker);
    });
    this.putPlacesOnMap(i+1, results);
  }

}

module.exports = googleMapServices;

