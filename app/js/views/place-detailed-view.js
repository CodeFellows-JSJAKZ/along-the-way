var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');

var template = require('../../templates/place-detailed.hbs');

/* View for a single place object. */
var PlaceDetailedView = Backbone.View.extend({

	template: template,

	initialize: function () {
		_.bind(this.render, this);
	},

	events: {
		'click a.back-button': 'showList'
	},

	render: function() {
		var attr = this.model.toJSON();

		// Replace newlines with <br>
		attr.address = attr.address.replace(/(?:\r\n|\r|\n)/g, '<br>');

    this.$el.html(this.template(attr));
		return this;
	},

	showList: function () {
		$('#single-place').hide();
		$('#places-list-wrap').show();
	}

});

module.exports = PlaceDetailedView;


