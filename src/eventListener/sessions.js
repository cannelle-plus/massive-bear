var assert = require('chai').assert;
var Session = require('./session');

var Sessions = function(eventStore){

	assert.ok(eventStore, 'Sessions : eventStore is not defined');

	var _sessions = {};

	var _getSessionId = function(id){
		return 'session' + id;
	};

	this.save = function(user){
		assert.ok(user, 'Sessions : user is not defined');		
		assert.ok(user.id, 'Sessions : user has no id defined');		

		_sessions[_getSessionId(user.id)] = new Session(user, eventStore);

		return _sessions[_getSessionId(user.id)];
	};

	this.retrieveSession = function(user){
		assert.ok(user, 'Sessions : user is not defined');		
		assert.ok(user.id, 'Sessions : user has no id defined');		

		return _sessions[_getSessionId(user.id)];
	};

	// 
	
};

module.exports = Sessions;