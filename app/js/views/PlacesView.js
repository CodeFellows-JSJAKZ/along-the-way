var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');

var PlaceView = require('./PlaceView.js');

var PlacesView = Backbone.View.extend({
	initialize: function(){
		_.bind(this.render, this);
	},

	el: '#places-list',

	render: function render() {
		console.log('places view render', this);
		function createPlace(place) {
			var placeView = new PlaceView({ model: place });
			this.$el.append(placeView.render().el);
		}
		_.each(this.collection, createPlace, {this: this});
		return this;
	}

});

module.exports = PlacesView;

