var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');

var router = require('./../router.js');
var template = require('../../templates/place.hbs');

/* View for a single place object within a list. */
var PlaceView = Backbone.View.extend({

	template: template,

	initialize: function () {
		_.bind(this.render, this);
		_.bind(this.showDetails, this);
	},

	events: {
		'click': 'showDetails'
	},

	render: function render() {
    //individual place view with map
    this.$el.html(this.template(this.model.toJSON()));
    return this;
	},

	showDetails: function () {
    Backbone.history.navigate(Backbone.history.fragment + '/' + this.model.cid,
      {trigger: true});
	}

});

module.exports = PlaceView;

