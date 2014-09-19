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

var createApp =function (app) {
   
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
  app.get('/auth/facebook/callback',passport.authenticate('facebook', { failureRedirect: '/login' }),
                                                            function(req, res) { res.redirect('/games');});

  app.get('/auth/google',passport.authenticate('google'),function(req, res){});
  app.get('/auth/google/callback',passport.authenticate('google', { failureRedirect: '/login' }),function(req, res) {res.redirect('/games');});

  var options = {
                  root: './www-root/',
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

   

  return app;
};


var createRouting = function(app, handlers)
{
  //todo check interface
  
  var appWithAuthentication= createApp(app);

  function ensureAuthenticated(req, res, next) {
    // if (req.isAuthenticated()) { return next(); }
    // res.redirect('/login')
    req.user = {id:'007', username:'bond'};
    return next();
  }

  var _createRouter  = function(app,ensureAuthentication){

    //todo Check the interface
    var _app = app;
    var _ensureAuthentication = ensureAuthentication;

    var _get = function(route,handler)
    {
        _app.get(route,_ensureAuthentication,handler);
    };

    var _post = function(route,handler)
    {
        _app.post(route,_ensureAuthentication,handler);
    };

    return {
      get : _get,
      post : _post,
    };
  };

  var router = _createRouter(appWithAuthentication,ensureAuthenticated);
  
  router.get('/getBear', handlers.bear.getBear);

  
  router.get('/gamesList',handlers.game.getGameList);
  router.get('/games',handlers.game.getGames);

  router.post('/game/creategame',handlers.game.createGame);
  router.post('/game/joingame',handlers.game.joinGame);
  router.post('/game/abandongame',handlers.game.abandonGame);
  router.post('/game/cancelgame',handlers.game.cancelGame);
 
};

module.exports = createRouting;


