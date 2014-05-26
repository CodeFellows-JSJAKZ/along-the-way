var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');

var PlaceView = require('./place-view.js');
var template = require('./../../templates/place-collection.hbs');

/* View for a collection of places
 *
 *
 */
var PlaceCollectionView = Backbone.View.extend({

	events: {
		'click a.back-button': 'showLocations'
	},

	el: '#places-wrapper',

  template: template,

	render: function render() {

		this.$el.html(this.template());

		_.each(this.collection.models, function (place) {
			if (place.attributes.name !== undefined) {
				var placeView = new PlaceView({
					model: place
				});
				placeView.render();
			}
		});
		return this;
	},

	showLocations: function () {
		$('#places-wrapper').hide();
		$('#location-wrapper').show();
	}

});

module.exports = PlaceCollectionView;

