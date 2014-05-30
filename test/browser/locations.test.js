var expect = require('chai').expect;
var Location = require('../../app/js/models/location-model.js');

describe('Location', function () {


	var location1, location2;

	before(function () {

		location1 = new Location({
			search: 'Seattle, WA',
			order: 0
		});

		location2 = new Location({
			search: 'Portland, OR',
			order : 1
		});

	});

	describe('model', function () {

		this.timeout(4000);

		it('#1 and #2 should both exist', function (done) {
			expect(location1).to.be.ok;
			expect(location2).to.be.ok;
			setTimeout(done, 2000);
		});

		it('#1 should have a valid latitude', function () {
			expect(location1.get('lat')).to.be.ok;
			expect(location1.get('lat')).to.be.at.least(-90);
			expect(location1.get('lat')).to.be.at.most(90);
		});

		it('#1 should have a valid longitude', function () {
			expect(location1.get('lng')).to.be.ok;
			expect(location1.get('lng')).to.be.at.least(-180);
			expect(location1.get('lng')).to.be.at.most(180);
		});

		it('#2 should have a valid latitude', function () {
			expect(location2.get('lat')).to.be.ok;
			expect(location2.get('lat')).to.be.at.least(-90);
			expect(location2.get('lat')).to.be.at.most(90);
		});

		it('#2 should have a valid longitude', function () {
			expect(location2.get('lng')).to.be.ok;
			expect(location2.get('lng')).to.be.at.least(-180);
			expect(location2.get('lng')).to.be.at.most(180);
		});

	});

});
