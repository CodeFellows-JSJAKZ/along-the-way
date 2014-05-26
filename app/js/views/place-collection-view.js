var Backbone = require('backbone');
var _ = require('underscore');

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

    // If there is no Places collection, back to the home page
		if (typeof this.collection.models === undefined) {
			Backbone.history.navigate('');
			return false;
		}

		var that = this;

		_.each(this.collection.models, function (place) {
      // console.log('place in _.each');
			// console.dir(place);
			if (typeof place.attributes.name !== 'undefined') {
				var placeView = new PlaceView({ model: place });
				that.$el.append(placeView.render().el);
			}
		});
		return this;
	}

});

module.exports = PlaceCollectionView;

