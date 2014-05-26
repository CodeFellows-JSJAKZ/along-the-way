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

	render: function() {
    // scroll to top so they see the new content
    window.scrollTo(0, 0);

		var attr = this.model.toJSON();
		// Replace newlines with <br>
		attr.address = attr.address.replace(/(?:\r\n|\r|\n)/g, '<br>');

    this.$el.html(this.template(attr));
		return this;
	},

});

module.exports = PlaceDetailedView;


