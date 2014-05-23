var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');

var Place = require('../models/Place.js');
var PlaceView = require('./PlaceView.js');

var PlacesView = Backbone.View.extend({
	initialize: function(){
		_.bind(this.render, this);
	},

	el: '#places-list',

	events: {
		'click p': 'showSingle'
	},

	render: function render() {
		console.log('places view render', this.collection);
		var that = this;
		_.each(that.collection, function (place) {
			console.dir('place in _.each: ' + place);
			var placeView = new PlaceView({ model: place });
			that.$el.append(placeView.render().el);
		});
		return this;
	},

	showSingle: function () {

		console.log('Showing single...');

		$('#places-list-wrap').hide();
		$('#single-place').show();

		// New place instance
		var place1 = new Place({
			name   : 'A Single Place',
			type   : 'sushi, burgers, curry, wine',
			lat    : 43,
			long   : -122,
			rating : 4.5,
			phone  : '206-369-4272',
			address: '4206 32nd Ave W\rSeattle, WA, 98199'
		});

		// New place view
		var placeView = new PlaceView({
			model: place1
		});

		placeView.render();
	}

});

module.exports = PlacesView;

