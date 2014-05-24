var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');

var Place = require('../models/place-model.js');
var PlaceView = require('./place-view.js');
var template = require('./../../templates/place-collection.hbs');

var PlaceCollectionView = Backbone.View.extend({
	initialize: function(){
		_.bind(this.render, this);
	},

  template: template,

	events: {
		'click p': 'showSingle'
	},

	render: function render() {
    console.log(this.$el);
		console.log('places view render', this.collection);
		var that = this;
    var collection = this.collection;
		_.each(collection.models, function (place, key, list) {
      console.log('place in _.each');
			//console.dir(place);
			var placeView = new PlaceView({ model: place });
			that.$el.append(placeView.render().el);
		});
		return this;
	},

	showSingle: function () {

		console.log('Showing single...');

    $('#location-list').hide();
		$('#places-list').hide();
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
      el: $('#single-place'),
			model: place1
		});

		placeView.renderSingle();
	}

});

module.exports = PlaceCollectionView;

