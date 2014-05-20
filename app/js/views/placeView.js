var Backbone = require('backbone');

var singlePlaceTpl = require('../../templates/placeView.hbs');
var listPlaceTpl = require('../../templates/placeListView.hbs');

var PlaceView = Backbone.View.extend({

	el: '#single-place',

	templateSingle: singlePlaceTpl,
	templateList: listPlaceTpl,

  renderSingle: function render() {
    console.log('Single place is RENDERING!');
    this.$el.html(this.templateSingle(this.model.toJSON()));
    return this;
  },

  renderList: function render() {
    console.log('List places is RENDERING!');
    this.$el.html(this.templateList(this.model.toJSON()));
    return this;
  }
});

module.exports = PlaceView;
