var assert = require('chai').assert;
var Session = require('./session');

var Sessions = function(eventStore){

	assert.ok(eventStore, 'Sessions : eventStore is not defined');

	var _sessions = {};

	var _getSessionId = function(id){
		return 'session' + id;
	};

	this.save = function(bear){
		assert.ok(bear, 'Sessions : bear is not defined');		
		assert.ok(bear.userId, 'Sessions : bear has no userId defined');		

		// console.log("***********saving session***********");

		_sessions[_getSessionId(bear.userId)] = new Session(bear, eventStore);

		return _sessions[_getSessionId(bear.userId)];
	};

	this.retrieveSession = function(user){
		
		if (!user)
			return null;

		assert.ok(user.userId, 'Sessions : user has no userId defined');		

		return _sessions[_getSessionId(user.userId)];
	};

	// 
	
};

module.exports = Sessions;