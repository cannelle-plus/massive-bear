var express = require('express');
var Middleware = require('./routes/middleware');
var Q = require('q');
var bodyParser = require('body-parser');

var app = function(eventSource) {

	var _handlers = [];

	var router = express.Router();
	var app = express();

	var middleware = new Middleware(router, eventSource);

	this.addHandlers = function(handlers) {
		_handlers.push(handlers);
	};

	this.addUserLoggedin = function(user) {

		middleware.login(user);
	};

	this.start = function(port) {


		for (var i = _handlers.length - 1; i >= 0; i--) {
			middleware.addRoutes(_handlers[i]);
		}

		app.use(bodyParser.json());

		// apply the routes to our application
		app.use('/', router);

		app.listen(port);

		return app;
	};
};

module.exports = app;