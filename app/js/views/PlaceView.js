var Backbone = require('backbone');
var $ = require('jquery');

var placeTpl = require('../../templates/placeView.hbs');
var placeListTpl = require('../../templates/place.hbs');

var PlaceView = Backbone.View.extend({

	el: 'li',

	template    : placeTpl,
	templateList: placeListTpl,

	events: {
		'click a.back-button': 'showList'
	},

	render: function render() {
		var attr = this.model.toJSON();

		// Replace newlines with <br>
		attr.address = attr.address.replace(/(?:\r\n|\r|\n)/g, '<br>');

		// Create a URL-friendly name
		attr.urlName =
		this.$el.html(this.template(attr));
		return this;
	},

	renderList: function render() {
		return this.templateList(this.model.toJSON());
	},

	showList: function () {
		$('#single-place').hide();
		$('#places-list-wrap').show();
	}

});

module.exports = PlaceView;
