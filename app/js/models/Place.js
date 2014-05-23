var Backbone = require('backbone');

/* Place should have
 *   name: String
 *   lat: Number,
 *	 lng: Number,
 *   rating: Number 0.0 to 5.0
 *   types - list of types this place falls under
 *   vicinity - address without state/country/etc.
 */
var Place = Backbone.Model.extend({
	defaults: {
		name: 'A Place',
		lat: 0,
		lng: 0,
		rating: 0,
		phone: '',
		address: ''
	}
});

module.exports = Place;


