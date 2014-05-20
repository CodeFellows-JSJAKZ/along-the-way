var $ = require('jquery');
var Backbone = require('backbone');
var handlebars = require('handlebars');
//var tmpl = require('./../../template/locationTmpl');

var locationView = Backbone.View.extend({
  template: handlebars.compile("<div>{{search}} {{lat}} {{lng}}</div>"),


  render: function render () {
    console.log('location view render');
    console.log(this.model.toJSON());
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  }
});

module.exports = locationView;
