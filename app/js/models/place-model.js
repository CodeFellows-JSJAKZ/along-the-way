var Backbone = require('backbone');

/* Defines a place. Populated with data from google maps:
 *    {String} name
 *    {Number} lat
 *    {Number} lng
 *    {Number} rating 0.0 to 5.0
 *  {String[]} types
 *    {String} address (without state/country/etc.)
 */
var Place = Backbone.Model.extend({
	defaults: {
		name: '',
		lat: null,
		lng: null,
		rating: null,
    types: [],
		address: ''
	}
});

module.exports = Place;


