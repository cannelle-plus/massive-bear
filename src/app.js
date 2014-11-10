var express = require('express');
var expressSession = require('express-session');
var Middleware = require('./routes/middleware');
var Q = require('q');
var bodyParser = require('body-parser');
var path = require('path');
var logger = require('morgan');
var favicon = require('serve-favicon');
var config = require('./oauth.js');
var methodOverride = require('method-override');
var errorHandler = require('errorhandler');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google').Strategy;

var app = function(eventSource) {

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


	// serialize and deserialize
	passport.serializeUser(function(user, done) {
		done(null, user);
	});
	passport.deserializeUser(function(obj, done) {
		done(null, obj);
	});

	// config social authentication
	passport.use(new FacebookStrategy({
			clientID: config.facebook.clientID,
			clientSecret: config.facebook.clientSecret,
			callbackURL: config.facebook.callbackURL
		},
		function(accessToken, refreshToken, profile, done) {
			process.nextTick(function() {
				return done(null, profile);
			});
		}
	));

	passport.use(new GoogleStrategy({
			returnURL: config.google.returnURL,
			realm: config.google.realm
		},
		function(identifier, profile, done) {
			process.nextTick(function() {
				profile.identifier = identifier;
				return done(null, profile);
			});
		}
	));

	app.use(expressSession({
		secret: 'my_precious',
		saveUninitialized: true,
		resave: true
	}));

	app.use(passport.initialize());
	app.use(passport.session());

	app.get('/auth/facebook', passport.authenticate('facebook'), function(req, res) {});
	app.get('/auth/facebook/callback', passport.authenticate('facebook', {
			failureRedirect: '/login'
		}),
		function(req, res) {
			res.redirect('/games');
		});

	app.get('/auth/google', passport.authenticate('google'), function(req, res) {});
	app.get('/auth/google/callback', passport.authenticate('google', {
		failureRedirect: '/login'
	}), function(req, res) {
		res.redirect('/games');
	});

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



		// apply the routes to our application
		app.use('/', router);

		app.listen(port);

		return app;
	};
};

module.exports = app;