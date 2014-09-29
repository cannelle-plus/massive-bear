/**
* Module dependencies.
*/
var env = require('node-env-file');
var express = require('express');
var http = require('http');
var path = require('path');
var logger = require('morgan');
var bodyParser= require('body-parser');
var favicon= require('serve-favicon');
var methodOverride = require('method-override');
var errorHandler = require('errorhandler');

env(__dirname + '/prod.env');


var projections = require('./model/projections')(process.env.connStringBear2Bear);

//var dispatcher = new require('./dispatcher/fileWriter')();
var dispatcher = new require('./dispatcher/wookie')(process.env.wookieHost, process.env.wookiePort);

var game = require('./model/game')(dispatcher);

var ges = require('./listenner/ges');

var router = require('./routes');

var GameHandler = require('./handlers/games');
var BearHandler = require('./handlers/bears');


var app = express();

//uncomment to access eventStore subscription
// ges();	
	

// all environments
app.set('port', process.env.PORT || 8888);
app.set('views', __dirname + '/views');
app.use(favicon(__dirname + '/../www-root/images/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, '/../www-root')));

var handlers = {
	game : new GameHandler(projections, game),
	bear : new BearHandler(projections, game)
};

router(app,handlers);

// development only
if ('development' == app.get('env')) {
	app.use(errorHandler());
}


http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
 	
});


module.exports = app;
