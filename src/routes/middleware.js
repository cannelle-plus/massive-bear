var assert = require('chai').assert;
var logger = require('../logger');
var Sessions = require('../eventListener/sessions');
var Q = require('q');


var middleware = function( router, source) {
	var _params = {};

	assert.ok(router, 'middleware : router is not defined');
	assert.ok(source, 'middleware : source is not defined');

	var _sessions = new Sessions(source);
	var _webSockets = null;

	var _returnJsonTo = function(res) {
		return function(jsonData) {
			console.log('***********response json ***************************');
			console.log(jsonData);
			console.log('**************************************');
			res.json(jsonData);
		};
	};

	var _withSession = function(handles) {
		return function(req, res) {

			var session = _sessions.retrieveSession(req.user);

			handles(session)(req,res);
		};
	};

	var _defaultHandles = function(extractInfosFrom, ExecuteIn) {
		return function(req, res, next) {


			var session = _sessions.retrieveSession(req.user);

			if (!session) {
				res.status(401).send("session unavailable");
			}
			else
			{
				// console.log('***********session bear ***************************');
				// console.log(session.bear());
				// console.log('**************************************');

				extractInfosFrom(req).And(ExecuteIn(session))
					.then(_returnJsonTo(res))
					.fail(function(err) {
						if (err.statusCode) {
							res.status(err.statusCode).send(err.message);
						} else {
							
							res.status(500).send({
								error: err
							});
						}
					})
					.done();

			}
		};

	};

	var _assertRoute = function(route) {
		assert.ok(route, 'middleware : route is not defined');
		assert.ok(route.url, 'middleware : route url is not defined');
		assert.ok(route.verb, 'middleware : route verb is not defined');
		assert.ok(route.extract, 'middleware : route extract is not defined');
		assert.ok(route.execute, 'middleware : route execute is not defined');
	};


	var _addroute = function(route) {
		_assertRoute(route);

		if (route.handles)
			router[route.verb.toLowerCase()](route.url, _withSession(route.handles));
		else
			router[route.verb.toLowerCase()](route.url, _defaultHandles(route.extract, route.execute));
	};

	var _addParam = function(p) {
		assert.ok(p.name, 'middleware : name is not defined');
		assert.ok(p.handles, 'middleware : handles is not defined');

		if (_params[p.name]) {
			logger.debug('Unable to add p (' + p.name + ', handles : ' + p.handles + ') because it already exists ');
			return;
		}

		router.param(p.name, p.handles);
		_params[p.name] = true;
	};

	this.addRoute = function(route) {
		_addroute(route);
	};

	this.addRoutes = function(routes) {
		assert.ok(routes, 'middleware : routes are not defined');

		for (var prop in routes) {
			var route = routes[prop];

			if (route.params) {

				for (var i = route.params.length - 1; i >= 0; i--) {
					_addParam(route.params[i]);
				}
			}
			_addroute(route);
		}

	};

	this.addParam = function(param) {
		assert.ok(param, 'middleware : param is not defined');
		_addParam(param);
	};

	this.login = function(bear) {
		// console.log('***********save bear ***************************');
		// console.log(bear);
		// console.log('**************************************');
		return _sessions.save(bear);
	};

	this.activateWebSocket = function(http, WebSocket){
		
		_webSockets = new WebSocket(http, _sessions);
	};

};

module.exports = middleware;