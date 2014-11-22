var express = require('express');
var expressSession = require('express-session');
var Middleware = require('./routes/middleware');
var Q = require('q');
var bodyParser = require('body-parser');
var path = require('path');
var logger = require('morgan');
var favicon = require('serve-favicon');
var methodOverride = require('method-override');
var errorHandler = require('errorhandler');


var app = function(eventSource, authenticate) {

	var _handlers = [];

	var router = express.Router();
	var app = express();

	var middleware = new Middleware(router, eventSource);


	app.use(express.static(path.join(__dirname, '/../www-root')));
	app.use(favicon(__dirname + '/../www-root/images/favicon.ico'));
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json());
	app.use(methodOverride());

	app.use(expressSession({
		secret: 'my_precious',
		saveUninitialized: true,
		resave: true
	}));

	var options = {
		root: './www-root/',
		dotfiles: 'deny',
		headers: {
			'x-timestamp': Date.now(),
			'x-sent': true
		}
	};

	// Send login form
	app.get('/login', function(req, res) {
		if (req.isAuthenticated())
			res.redirect('/games');
		else
			res.sendFile('login.html', options);
	});

	// Disable user auth token
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	this.addHandlers = function(handlers) {
		_handlers.push(handlers);
	};

	this.addUserLoggedin = function(user) {

		middleware.login(user);
	};

	this.toggleLog= function(){
		app.use(logger('dev'));
	};

	this.start = function(port) {

		for (var i = _handlers.length - 1; i >= 0; i--) {
			middleware.addRoutes(_handlers[i]);
		}

		authenticate(app, middleware);

		// apply the routes to our application
		app.use('/', router);

		app.listen(port);

		return app;
	};
};

module.exports = app;
