var expect = require('chai').expect;
var $ = require('jquery');
var googleMapServices = require('./../../app/js/apis/googleMaps.js');
var superagent = require('superagent');

describe('Google Maps API', function() {

  before(function() {
  });

  it('initialize should geocode the geolocation', function() {
    superagent.get('', function(res){
      setTimeout(function() {
        expect(googleMapServices.geocoder).to.exist;
        expect($('#start-input').val()).to.exist;
        console.log('timeout up');
      }, 1000);
    });
  });

  it('createMap should create Map and PlacesService', function() {
    superagent.get('', function(res){
      setTimeout(function() {
        expect(googleMapServices.map).to.exist;
        expect(googleMapServices.placesService).to.exist;
      }, 1000);
    });
  });
});
