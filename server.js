var express = require('express');
var mongoose = require('mongoose');
var Location = require('./models/Location.js');

var app = express();
app.set('port', process.env.PORT || 3000);

// serve static files in dist
app.use(express.static(__dirname + '/dist'));

// connect to database
var dbUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL ||'mongodb://localhost/alongtheway';
mongoose.connect(dbUri, function (err) {
  if (err) {
   console.error('ERROR: Could not connect to database - ' + err);
  }
});

// routes
var apiPrefix = '/api/v0_0_1';

// example fetch all locations
app.get(apiPrefix + '/locations', function (req, res) {
  console.log('Fetching all locations');
  return Location.find(function (err, books) {
    if (err) {
      return res.send(500, {error: 'Error querying database'});
    }
    return res.send(books);
  });
});

// start server
var server = app.listen(app.get('port'), function() {
  console.log('The server is running on ' + app.get('port'));
});

