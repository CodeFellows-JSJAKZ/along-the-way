var Backbone = require('backbone');
var _ = require('underscore');

var PlaceView = Backbone.View.extend({
  template: _.template('<li><%= name =></li>'),

  render: function render() {
    console.log('PlaceView render');
    console.log(this.model.attributes);
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  }
});

module.exports = PlaceView;
