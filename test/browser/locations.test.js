var expect = require('chai').expect;
var Location = require('../../app/js/models/location-model.js');
var googleMapServices = require('../../app/js/apis/googleMaps.js');

describe('Location', function () {

	var location;

	beforeEach(function () {
		location = new Location({
			search: 'Seattle, WA',
			order: 0
		});
	});

	describe('model', function () {

	this.timeout(4000);

		it('should exist', function (done) {
			expect(location).to.be.ok;
			setTimeout(done, 3000);
		});

		it('should geocode an address or provide an error', function() {
			console.dir(location);
			console.log('Lat: ' + location.attributes.lat);
			console.log('Lng: ' + location.get('lng'));
			expect(location.get('lat')).to.be.ok;
			expect(location.get('lng')).to.be.ok;
		});

		it('should have a latitude');

		it('should have a longitude');

		it('should build a route');

	});

});
