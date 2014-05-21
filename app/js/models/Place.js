var Backbone = require('backbone');

/* Place should have
 *   name: String
 *   coords: Object {lat: __, lng: __}
 *   rating: Number 0.0 to 5.0
 *   types - list of types this place falls under
 *   vicinity - address without state/country/etc.
 */
var Place = Backbone.Model.extend({
	defaults: {
		name: 'A Place',
		type: 'food, beer, pool, stuff',
		lat: 0,
		long: 0,
		rating: 0,
		phone: '',
		address: ''
	}
});

module.exports = Place;


