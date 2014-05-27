var expect = require('chai').expect;
var Place = require('../../app/js/models/place-model.js');
var PlaceCollection = require('../../app/js/collections/place-collection.js');



describe('Place', function () {

	var place, place2, places;

	var newPlaceName = 'This is a place!';

	beforeEach(function () {

		place = new Place({
			name: newPlaceName
		});

		place2 = new Place();

		places = new PlaceCollection([place, place2]);

	});

	describe('model', function () {

		it('should exist', function () {
			expect(place).to.be.ok;
		});

		it('should save name passed in on creation', function () {
			expect(place.get('name')).to.equal(newPlaceName);
		});

	});

	describe('collection', function () {

		it('should exist', function () {
			expect(places).to.be.ok;
		});

		it('should have the correct number of models', function () {
			expect(places.length).to.equal(2);
		});

	});

});