var Backbone = require('backbone');
var $ = require('jquery');

var template = require('../../templates/place.hbs');

/* View for a single place object within a list. */
var PlaceView = Backbone.View.extend({

	events: {
		'click li p': 'showDetails'
	},

	template: template,

	render: function render() {
    $(this.$el.html(this.template(this.model.toJSON()))).prependTo('#places-list');
    return this;
	},

	showDetails: function () {
    Backbone.history.navigate(Backbone.history.fragment + '/' + this.model.cid, {
			trigger: true
		});
	}

});

module.exports = PlaceView;

