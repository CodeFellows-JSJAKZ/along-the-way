var LocationView = require('./views/LocationView.js');

var Router = Backbone.Router.extend({

  routes: {
    "home": "viewLocation" // REPLACE with real routes
  },

  // functions here should set html using views
  viewLocation: function () {
    return new LocationView({});
  }

});

module.exports = Router;

