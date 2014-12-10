var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google').Strategy;
var config = require('./oauth.js');
var uuid = require('node-uuid');
var Bear = require('../model/bear');

var socialAuth = function(bearRepo) {
	return function(app, middleware) {

		// serialize and deserialize
		passport.serializeUser(function(user, done) {
			// console.log('**********serialize user ***************************************');
			// console.log(user)
			// console.log('*************************************************');
			done(null, user);
		});
		passport.deserializeUser(function(obj, done) {
			// console.log('**********deserialize obj ***************************************');
			// console.log(obj)
			// console.log('*************************************************');
			done(null, obj);
		});


		var redirectTo = function(req, res) {
			
			
		};

		// config social authentication
		passport.use(new FacebookStrategy({
				clientID: config.facebook.clientID,
				clientSecret: config.facebook.clientSecret,
				callbackURL: config.facebook.callbackURL
			},
			function(accessToken, refreshToken, profile, done) {
				process.nextTick(function() {
					bearRepo.hasSignedIn(profile.id)
							.then(function(bear) {
								if (bear){
									//do the bindings
									bear.userId = uuid.v1();
									bear.
									bear.hasSignedIn = true;
									

									middleware.login(bear);

									// console.log('**********bear session ***************************************');
									// console.log(bear.userId);
									// console.log('*************************************************');
									done(null,{ userId : bear.userId } );	
								}
								else
								{
									var newBear = new Bear(uuid.v1(), profile.id, "A renseigner", 1, false);

									newBear.userId = uuid.v4();

									middleware.login(newBear);

									done(null, { userId : newBear.userId } );	
								}
								
							})
							.catch(function(err) {
								done(err);
							});
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
			successRedirect : "/games",
			failureRedirect: '/'
		}));

		// app.get('/auth/google', passport.authenticate('google'), function(req, res) {});
		// app.get('/auth/google/callback', passport.authenticate('google', {
		// 	failureRedirect: '/login'
		// }), redirectTo);

		app.use(function (req, res, next) {
	  		req.isAuthenticated();
	  		next();
	    });

	};
};

module.exports = socialAuth;