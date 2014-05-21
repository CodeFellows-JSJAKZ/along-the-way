var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');

var PlaceView = require('./PlaceView.js');

var placesTpl = require('../../templates/placeListView.hbs');

var PlacesView = Backbone.View.extend({

	el: '#places-list',

	template    : placesTpl,

	render: function render() {
		console.log('Place collection is RENDERING!');
		this.collection.forEach(function (place) {
			var placeView = new PlaceView({ model: place });
			this.$el.append(placeView.renderList());
		}, this);
		return this;
	}

});

module.exports = PlacesView;