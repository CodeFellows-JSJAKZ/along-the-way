var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');

var PlaceView = require('./PlaceView.js');

var PlacesView = Backbone.View.extend({

	el: '#places-list',

	render: function render() {
		this.collection.forEach(function (place) {
			var placeView = new PlaceView({ model: place });
			this.$el.append(placeView.renderList());
		}, this);
		return this;
	}

});

module.exports = PlacesView;