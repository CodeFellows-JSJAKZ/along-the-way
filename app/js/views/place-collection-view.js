var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');

var Place = require('../models/place-model.js');
var PlaceView = require('./place-view.js');
var template = require('./../../templates/place-collection.hbs');

/* View for a collection of places */
var PlaceCollectionView = Backbone.View.extend({

	initialize: function(){
		_.bind(this.render, this);
	},

  template: template,

	render: function render(locationStr) {
    this.$el.html(this.template({location: locationStr}));
    var ul = $('#places-list');
		var that = this;
		_.each(this.collection.models, function (place, key, list) {
			var placeView = new PlaceView({ model: place });
			ul.append(placeView.render().el);
			return this;
	  });
  }
});

module.exports = PlaceCollectionView;

