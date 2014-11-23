var assert = require('chai').assert;
var logger = require('../logger');

var Session = function(bearSession, eventSource){

	assert.ok(bearSession, 'Session : bearSession is not defined');
	assert.ok(eventSource, 'Session : eventSource is not defined');

	var _subscriptions = [];
	var _sockets = [];
	var send = null;
	var _bear = bearSession;

	this.bear = function (){
		return _bear;
	};

	var _subscribeToSocket = function(subscription, socket){
		subscription.subscribe(
			function (x) {
        		socket.emit('event', x);
		    },
		    function (err) {
		        logger.error('Error: ' + err);
		    },
		    function () {
		        logger.error('completed');
		    }
		);
	};

	this.addSubscription = function(predicate){
		//create the observable
		var _observable = eventSource.where(predicate);

		//add the subscription to every opened socket
		for (var i = _sockets.length - 1; i >= 0; i--) {
			_subscribeToSocket(_observable, _sockets[i]);
		}

		//save the subscription for new socket to arrive
		_subscriptions.push(_observable);
	};


	this.addSocket = function(socket){

		//update the socket with every known subscription this session has
		for (var i = _subscriptions.length - 1; i >= 0; i--) {
			_subscribeToSocket(_subscriptions[i], socket);
		}

		//save the subscription for new subscription to arrive
		_sockets.push(socket);
	};
	
};

module.exports = Session;