var Backbone = require('backbone');

var placeTpl = require('../../templates/placeView.hbs');
var placeListTpl = require('../../templates/place.hbs');

var PlaceView = Backbone.View.extend({

	el: '#single-place',

	template    : placeTpl,
	templateList: placeListTpl,

	render: function render() {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	},

	renderList: function render() {
		return this.templateList(this.model.toJSON());
	}

});

module.exports = PlaceView;
