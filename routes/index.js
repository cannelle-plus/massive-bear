// Configuring Passport
//var passport = require('passport');
//var LocalStrategy = require('passport-local').Strategy;
// var session = require('express-session');
// var expressSession = require('express-session');

var expressSession = require('express-session');
var config = require('../oauth.js');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google').Strategy;


module.exports = function (app) {
   
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
                     process.nextTick(function () { 
                      return done(null, profile); });
                }
  ));

  passport.use(new GoogleStrategy({
              returnURL: config.google.returnURL,
              realm: config.google.realm},
              function(identifier, profile, done) {
                 process.nextTick(function () {
                 profile.identifier = identifier;
                 return done(null, profile);
               });}
));

  app.use(expressSession({secret: 'my_precious',
             saveUninitialized: true,
                       resave: true}));

  app.use(passport.initialize());
  app.use(passport.session());


  app.get('/auth/facebook',passport.authenticate('facebook'),function(req, res){});
  app.get('/auth/facebook/callback',passport.authenticate('facebook', { failureRedirect: '/login' }),function(req, res) { res.redirect('/games');});

  app.get('/auth/google',passport.authenticate('google'),function(req, res){});
  app.get('/auth/google/callback',passport.authenticate('google', { failureRedirect: '/login' }),function(req, res) {res.redirect('/games');});

var options = {
                root: './public/',
                dotfiles: 'deny',
                headers: {
                    'x-timestamp': Date.now(),
                    'x-sent': true
                 }
               };

// Send login form
app.get('/login', function(req, res){
  if(req.isAuthenticated())
    res.redirect('/games');
  else
    res.sendFile('login.html',options);
});

// Disable user auth token
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

 function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

app.post('/game/*', ensureAuthenticated,require('./games'));
app.get('/games*', ensureAuthenticated,require('./games'));
app.get('/bears*', ensureAuthenticated,require('./bears'));

    return app;
};



// app.use(expressSession({secret: 'my_precious',
// 						saveUninitialized: true,
//                  		resave: true}));


// app.use(passport.initialize());
// app.use(passport.session());

// passport.serializeUser(function(user, done) {
//   done(null, user.id);
// });

// passport.deserializeUser(function(id, done) {
//   // query the current user from database
//   User.find(id)
//     .success(function(user){
//         done(null, user);
//     }).error(function(err){
//         done(new Error('User ' + id + ' does not exist'));
//     });
// });

// passport.use(new LocalStrategy({
// 	usernameField: 'username',
//     passwordField: 'password',
//     passReqToCallback : true
//   },
//   function(req, username, password, done) { 

// console.log('auth '+username);
//   if (username=='aziz')
//   	console.log('ok')
//   var user = {
//   	id:'123',
//   	nom:'eb',
//   	prenom:'aziz'
//   }
//   return done(null, user);
//   //return done(null, false, { message: 'Invalid Password' });

// }));


// app.post('/login', passport.authenticate('local', { successRedirect: '/games',
//                                                 failureRedirect: '/login'}));

// 	var options = {
//     root: './public/',
//     dotfiles: 'deny',
//     headers: {
//         'x-timestamp': Date.now(),
//         'x-sent': true
//     	}
//   	};

// 	app.get('/login', function(req, res){
//   		res.sendFile('login.html',options);
// 	});


// 	function ensureAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) { return next(); }
//   res.redirect('/login')
// }

    // app.get('/games*', ensureAuthenticated,require('./games'));
    // app.get('/bears*', ensureAuthenticated,require('./bears'));

