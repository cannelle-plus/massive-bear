var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google').Strategy;
var config = require('./oauth.js');

var socialAuth = function(app, middleware) {

	// serialize and deserialize
	passport.serializeUser(function(user, done) {
		console.log(user);
		done(null, user);
	});
	passport.deserializeUser(function(obj, done) {
		console.log(obj);
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

	app.use(passport.initialize());
	app.use(passport.session());

	app.get('/auth/facebook', passport.authenticate('facebook'), function(req, res) {});
	app.get('/auth/facebook/callback', passport.authenticate('facebook', {
			failureRedirect: '/login'
		}),
		function(req, res) {
			console.log(req.user);
			middleware.login(req.user);
			res.redirect('/games');
		});

	app.get('/auth/google', passport.authenticate('google'), function(req, res) {});
	app.get('/auth/google/callback', passport.authenticate('google', {
		failureRedirect: '/login'
	}), function(req, res) {
		res.redirect('/games');
	});

};

module.exports = socialAuth;