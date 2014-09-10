/**
* Module dependencies.
*/
var express = require('express');
var http = require('http');
var path = require('path');
var logger = require('morgan');
var bodyParser= require('body-Parser');
var favicon= require('serve-favicon');
var methodOverride = require('method-override');
var errorHandler = require('errorhandler');


var app = express();


// all environments
app.set('port', process.env.PORT || 8888);
app.set('views', __dirname + '/views');
app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

var router = require('./routes')(app);

// development only
if ('development' == app.get('env')) {
	app.use(errorHandler());
}


http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
 	
});


module.exports = app;
