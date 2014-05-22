var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var PlaceView = require('./PlaceView.js');

var PlacesCollectionView = Backbone.View.extend({

  initialize: function initialize() {
    console.log('CollectionView initialize');
    this.placeViews = [];
    _.bind(this.add, this);
    _.bind(this.render, this);
    console.dir(this);
    this.collection.each(this.add, this);
  },

  add: function add(place) {
    var pv = new PlaceView({model: place});

    this.placeViews.push(pv);

    if (this.rendered) {
      this.$el.append(pv.render().el);
    }
  },


  render: function render() {
    console.log('PlacesCollectionView render');
    console.dir(this);
    this.rendered = true;
    console.log(this.$el);
    this.$el.empty();
    console.log(this.$el);
    _(this.placeViews).each(function(pv) {
      this.$el.append(pv.render().el);
    }, this);

    return this;
  }
    
});

module.exports = PlacesCollectionView;

