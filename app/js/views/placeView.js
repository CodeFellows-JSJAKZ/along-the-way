var Backbone = require('backbone');

var placeTpl = require('../../templates/placeView.hbs');
var placeListTpl = require('../../templates/placeListView.hbs');

var PlaceView = Backbone.View.extend({

	el: '#single-place',

	template    : placeTpl,
	templateList: placeListTpl,

	render: function render() {
		console.log('Single place is RENDERING!');
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	},

	renderList: function render() {
		console.log('Single place in a list is RENDERING!');
		return this.templateList(this.model.toJSON());
	}

});

module.exports = PlaceView;
