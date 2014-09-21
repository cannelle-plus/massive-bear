/**
* Module dependencies.
*/
var express = require('express');
var http = require('http');
var path = require('path');
var logger = require('morgan');
var bodyParser= require('body-parser');
var favicon= require('serve-favicon');
var methodOverride = require('method-override');
var errorHandler = require('errorhandler');

var wookieServer = {
	host : 'localhost',
	port : '8081'
};

var projections = require('./model/projections')('D:\\projects\\db-wookie\\db\\Bear2Bear.db');

//var dispatcher = new require('./dispatcher/fileWriter')();
var dispatcher = new require('./dispatcher/wookie')(wookieServer.host, wookieServer.port);

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
