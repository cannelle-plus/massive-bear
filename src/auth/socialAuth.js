var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google').Strategy;
var config = require('./oauth.js');

var socialAuth = function(app, middleware, bearRepo) {

	// serialize and deserialize
	passport.serializeUser(function(user, done) {
		console.log(user);
		done(null, user);
	});
	passport.deserializeUser(function(obj, done) {
		console.log(obj);
		done(null, obj);
	});

	var hasSignedIn = function(user){
		var bear = bearRepo.hasSignedIn(user.id);

		return bear;
	};

	var redirectTo = function(req, res) {
		var bear = hasSignedIn(req.user);

		if (bear)
		{
			middleware.login(bear);
			res.redirect('/games');
		}
		else
		{
			middleware.login(req.user);
			res.redirect('/signin');
		}
	};

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
	app.get('/auth/facebook/callback', passport.authenticate('facebook', {failureRedirect: '/login'	}),redirectTo );

	app.get('/auth/google', passport.authenticate('google'), function(req, res) {});
	app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), redirectTo );

};

module.exports = socialAuth;