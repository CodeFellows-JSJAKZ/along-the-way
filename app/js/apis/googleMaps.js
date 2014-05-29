var $ = require('jquery');
var template = require('./../../templates/place-detailed.hbs');
var _ = require('underscore');
var distanceTemplate = require('./../../templates/distance.hbs');


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


  /* Set up maps services:
   *   Create map
   *   Initialize geocoder
   *   Reverse geocode starting location
   *   Initialize autocomplete
   */
  initialize: function(geoposition) {
    if (geoposition) {
      googleMapServices.createMap(geoposition.coords);
      this.geocoder = this.geocoder || new google.maps.Geocoder();
      var latlng = new google.maps.LatLng(geoposition.coords.latitude, geoposition.coords.longitude);
      this.geocoder.geocode({'latLng': latlng}, function (results, status) {
        $('#start-input').val(results[0].formatted_address);
        $('#loading-gif').hide();
      });
    } else {
      googleMapServices.createMap({lat: 0, lng: 0});
    }
    googleMapServices.initializeAutoComplete();

  },

  /* Create map to be used by all google maps services.
   * Initiate PlacesService using map
   */

  createMap: function createMap(coords) {
    var googCoords = new google.maps.LatLng(coords.latitude, coords.longitude);

    this.map = new google.maps.Map(document.getElementById('gmap'),{
      center: googCoords,
      zoom: 15
    });
    this.placesService = new google.maps.places.PlacesService(this.map);
  },

  /* Set up autocomplete to work when entering locations:
   *  Bind to start and end input fields
   */
  initializeAutoComplete: function() {
    var startInput = (document.getElementById('start-input'));
    var destInput = (document.getElementById('destination-input'));
    var autocomplete = new google.maps.places.Autocomplete(startInput);
    var autocomplete2 = new google.maps.places.Autocomplete(destInput);
    autocomplete.bindTo('bounds', this.map);
    autocomplete2.bindTo('bounds', this.map);
  },

  /* Geocode the given location (get lat and lng corresponding to its search string).
   * When coords are received, call the passed in function cb
   */
  geocodeLocation: function(location, cb) {
    // get or create geocoder
    this.geocoder = this.geocoder || new google.maps.Geocoder();
    this.geocoder.geocode({'address': location.get('search')},
      function(results, status) {
        var coords = null;
        var error = null;
        if (status == google.maps.GeocoderStatus.OK) {
          coords = results[0].geometry.location;
        } else {
          error = status; // set error property on location if geocode failed
        }
        cb(location, coords, error);
      });
  },

  /* Track whether we have all the information ro start building a route.
   *   Receive start, end, and type filters.  Wait for all 3 to proceed
   *   When ready, clear route and markers from map, call getDirections */
  buildRoute: function(location, placeTypes) {
    if (placeTypes) {
      this.placeTypes = placeTypes;
    } else if (location) {
      if (location.get('order') === 0) {
        this.start = location;
      } else { // assuming only 2
        this.end = location;
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
    }
  },

  /* Given start and end points, get a route. (Assumes driving)
   *   Puts route on map and calls createRouteBoxes
   */
  getDirections: function(start, end) {
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
        var distance = result.routes[0].legs[0].distance['text'];
        $('#distance').html(distanceTemplate({distance: distance}));
        return true;
      } else {
        console.warn(status);
        return false;
      }
    });
  },

  /* creates LatLngBounds that cover the entire route
   *   used to get places all along the way
  */
  createRouteBoxes: function(overview_path) {
    var boxes = this.routeBoxer.box(overview_path, 0.125);
    // find places in each box
    this.getNearbyPlaces(boxes, 0);
  },


  /* Get places for the given bounds.
   * When results are received, creates a marker for each on the map.
   * Sets click listener on the marker to show an InfoWindow
   */
  getNearbyPlaces: function(boxes, i) {
    if (i === boxes.length) {
      console.log('done searching for places');
      return;
    }
    var opts = {
      bounds: boxes[i]
    };
    // use given types, or null if none are specified
    if (this.placeTypes && this.placeTypes !== []) {
      opts.types = this.placeTypes;
    }

    // scope for the search callback
    var that = this;
    this.placesService.nearbySearch(opts, function(results, status) {
      // handle place results
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        console.log('places received; adding to map');
        that.putPlacesOnMap(results);
        that.getNearbyPlaces(boxes, i+1);
      } else if (status === google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT) {
        console.log('Over query limit; waiting 1 second');
        setTimeout(function() {
          that.getNearbyPlaces(boxes, i);
        }, 1000);
      } else {
        console.log('ERROR: ' + status);
        that.getNearbyPlaces(boxes, i+1);
      }
    });
  },

  /* Given nearbySeach results, put marker on map for each */
  putPlacesOnMap: function putPlacesOnMap(results) {
    // re-use the same infowindow for all markers
    this.infoWindow = this.infoWindow || new google.maps.InfoWindow();

    // set maximum places per routebox
    var maxPlaces = Math.min(5, results.length);

    for (var i = 0; i < maxPlaces; i++) {
      var result = results[i];

      // create marker, set place properties on it too
      var marker = new google.maps.Marker({
        position: result.geometry.location,
        map: this.map,
        visible: true,
        icon: '../../images/map_marker.png'
      });
      marker.name = result.name;
      marker.rating = result.rating;
      marker.vicinity = result.vicinity;
      marker.price_level = result.price_level;
      marker.type_icon = result.icon;
      if (result.opening_hours) {
     		marker.open_now = result.opening_hours.open_now;
      } else {
				marker.open_now = false;
      }

      // keep all markers in array so we can delete if needed
      this.markers.push(marker);

      // when marker is clicked, show infowindow
      var that = this;
      google.maps.event.addListener(marker, 'click', function() {
        // inside callback, this = marker
        that.infoWindow.open(that.map, this);
        that.infoWindow.setContent(template({
          name: this.name,
          rating: this.rating,
          address: this.vicinity,
					price_level: this.price_level,
					type_icon: this.type_icon,
					open_now: this.open_now
        }));
      });
    }
  },

  // types:[] to search for when returning places
  // see https://developers.google.com/places/documentation/supported_types
  filter: {
    entertainment: [
      'amusement_park', 'aquarium', 'art_gallery', 'bowling_alley', 'casino',
      'movie_rental', 'movie_theater', 'stadium', 'museum', 'night_club', 'park','zoo', 'bar'
    ],
    shopping: [
      'book_store', 'clothing_store', 'department_store', 'jewelry_store', 'shoe_store',
      'shopping_mall', 'pet_store', 'florist'
    ],
    householdGoods: [
      'electronics_store', 'home_goods_store', 'hardware_store', 'grocery_or_supermarket'
    ],
    services: [
      'car_repair', 'car_wash', 'gas_station', 'laundry', 'post_office', 'library', 'bicycle_store'
    ],
    food: [
    'bakery', 'bar', 'cafe', 'food', 'meal_delivery', 'meal_takeaway', 'restaurant',
    'grocery_or_supermarket', 'liquor_store'
    ],
    healthBeauty: [
      'beauty_salon', 'gym', 'hair_care', 'spa'
    ],
    transportation: [
      'bus_station', 'subway_station', 'taxi_stand', 'train_station'
    ],
    banking: [
      'atm', 'bank'
    ]
  },

  /* Compile user filters based on form input */
  filterFunc: function(checked){
    var finalFilter = [];
    if(checked.length === 0){
      finalFilter = this.filter.entertainment.concat(this.filter.shopping,
      this.filter.services, this.filter.food, this.filter.healthBeauty,
      this.filter.transportation, this.filter.banking, this.filter.householdGoods);
    }else{
      for(var i=0; i < checked.length; i++){
        finalFilter = finalFilter.concat(this.filter[checked[i]]);
      }
    }
    console.log('filter:');
    console.log(finalFilter);
    this.buildRoute(null, finalFilter);
  },

  /* Remove all markers from the map
   * (Used to reset between routes)
   */
  clearAllMarkers: function() {
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(null);
    }
    this.markers.length = 0;
  }
};

module.exports = googleMapServices;

