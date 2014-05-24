var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');

var template = require('../../templates/place.hbs');
var templateDetailed = require('../../templates/place-detailed.hbs');

/* View for a single place object. */
var PlaceView = Backbone.View.extend({

	template: template,
	templateDetailed: templateDetailed,

	initialize: function () {
		_.bind(this.render, this);
		_.bind(this.renderSingle, this);
	},

	events: {
		'click a.back-button': 'showList'
	},

	renderSingle: function() {
		var attr = this.model.toJSON();

		// Replace newlines with <br>
		attr.address = attr.address.replace(/(?:\r\n|\r|\n)/g, '<br>');

		// Create a URL-friendly name
		attr.urlName = this.$el.html(this.templateDetailed(attr));
		return this;
	},

	render: function render() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
	},

	showList: function () {
		$('#single-place').hide();
		$('#places-list-wrap').show();
	}

});

module.exports = PlaceView;

