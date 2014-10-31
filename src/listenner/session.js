var assert = require('chai').assert;
var logger = require('../logger');

var Session = function(userSession, eventSource){

	assert.ok(userSession, 'Session : user is not defined');
	assert.ok(eventSource, 'Session : eventSource is not defined');

	var _subscriptions = [];
	var send = null;
	var _user = userSession;

	this.user = function (){
		return _user;
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
		_subscriptions.push(eventSource.where(predicate));
	};


	this.addSocket = function(socket){
		for (var i = _subscriptions.length - 1; i >= 0; i--) {
			_subscribeToSocket(_subscriptions[i], socket);
		}
	};
	
};

module.exports = Session;