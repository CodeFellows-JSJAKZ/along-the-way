var Backbone = require('backbone');
var $ = require('jquery');

var template = require('../../templates/place-detailed.hbs');

/* View for a single place object. */
var PlaceDetailedView = Backbone.View.extend({

	events: {
		'click a.back-button': 'showPlaces'
	},

	template: template,

	el: '#single-place',

	render: function() {

		var attr = this.model.toJSON();

		// Replace newlines with <br>
		attr.address = attr.address.replace(/(?:\r\n|\r|\n)/g, '<br>');

    this.$el.html(this.template(attr));
		return this;
	},

	showPlaces: function () {
		this.$el.hide();
		$('#places-wrapper').show();
	}

});

module.exports = PlaceDetailedView;


