var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');

var Place = require('../models/place-model.js');
var PlaceView = require('./place-view.js');
var template = require('./../../templates/place-collection.hbs');

/* View for a collection of places
 *
 *
 */
var PlaceCollectionView = Backbone.View.extend({
	initialize: function(){
		_.bind(this.render, this);
	},

  template: template,

	render: function render() {
    //console.log(this.$el);
		//console.log('places view render', this.collection);
		var that = this;
		_.each(this.collection.models, function (place, key, list) {
			//console.dir(place);

			var placeView = new PlaceView({ model: place });
			//renders collection of places
			// that.$el.empty();
			if(placeView !== null || 0){
			that.$el.append(placeView.render().el);
			return this;
		}
		});

	}

});

module.exports = PlaceCollectionView;

