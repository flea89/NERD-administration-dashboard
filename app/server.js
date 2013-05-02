/**
 * Module dependencies.
 */
var express = require('express'),
  routes = require('./routes'),
  user = require('./routes/user'),
  entity = require('./routes/entity'),
  http = require('http'),
  mysql = require('mysql'),
  path = require('path');

var app = express();

/**
 * App configuration
 */
app.configure(function() {
  'use strict';
  // app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);

});

app.configure('development', function() {
  app.use(express.errorHandler());
});

app.get('/users', user.list);
app.get('/entities', entity.list);


var server = http.createServer(app);
exports = module.exports = server;

exports.use = function() {
  app.use.apply(app, arguments);
};