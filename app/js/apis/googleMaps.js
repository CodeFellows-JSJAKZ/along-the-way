var PlaceModel = require('./../models/place-model.js');
var $ = require('jquery');
var template = require('./../../templates/place-detailed.hbs');
var _ = require('underscore');

var googleMapServices = {

  // define object properties that are set later
  map: null,
  placesService: null,
  DirectionsService: null,
  directionsDisplay: null,
  geocoder: null,
  routeBoxer: new RouteBoxer(),
  markers: [],
  infoWindow: null,
  start: null,
  end: null,
  placeTypes: null,

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

  /* Receive start, end, and type filters.  Wait for all 3 to proceed */
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
    if (this.start && this.end && this.placeTypes) {
      if (this.directionsDisplay) {
        this.clearAllMarkers();
        this.directionsDisplay.setMap(null);
      }
      this.getDirections(this.start, this.end);
      this.start = null;
      this.end = null;
      this.placeTypes = null;
    }
  },

  getDirections: function getDirections(start, end) {
    var startLL = new google.maps.LatLng(start.get('lat'), start.get('lng'));
    var endLL = new google.maps.LatLng(end.get('lat'), end.get('lng'));
    this.directionsService = this.directionsService || new google.maps.DirectionsService();
    this.directionsDisplay = this.directionsDisplay || new google.maps.DirectionsRenderer();
    this.directionsDisplay.setMap(this.map);
    //this.directionsDisplay.setDirections({routes: []});

    var opts = {
      origin: startLL,
      destination: endLL,
      travelMode: google.maps.TravelMode.DRIVING
    };

    var that = this;
    this.directionsService.route(opts, function(result, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        that.directionsDisplay.setDirections(result);
        that.createRouteBoxes(result.routes[0].overview_path);
      } else {
        console.warn(status);
        return;
      }
    });
  },

  /* creates LatLngBounds that cover the entire route and can be used in nearbySeach */
  createRouteBoxes: function(overview_path) {
    var boxes = this.routeBoxer.box(overview_path, .125);
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
    var opts = {
      bounds: latLngBounds,
    }
    if (this.placeTypes && this.placeTypes !== []) {
      opts.types = this.placeTypes
    }

    var that = this;
    this.placesService.nearbySearch(opts, function(results, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        // re-use the same infowindow for all markers
        this.infoWindow = this.infoWindow || new google.maps.InfoWindow();
        for (var i = 0; i < results.length; i++) {
          var result = results[i];
          var marker = new google.maps.Marker({
            position: result.geometry.location,
            map: that.map,
            visible: true
          });
          that.markers.push(marker);
          var placeContent = template({
              name: result.name,
              rating: result.rating,
              address: result.vicinity
          });

          google.maps.event.addListener(marker, 'click', function(result) {
            this.infoWindow.setContent(template({
              name: result.name,
              rating: result.rating,
              address: result.vicinity
            }));
            this.infoWindow.open(that.map, marker);
          }(result, that));
        }
      } else {
        console.log('ERROR: ' + status);
      }
    }, this);
  },

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
      finalFilter = finalFilter.concat(this.filter[checked[i]]);
    }
    this.buildRoute(null, finalFilter);

  },
  
  clearAllMarkers: function() {
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(null);
    }
    this.markers.length = 0;
  }



}

global.GOOOGZ = googleMapServices;
module.exports = googleMapServices;

