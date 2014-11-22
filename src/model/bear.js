var assert = require('chai').assert;

var Bear = function(id, username, avatarId){

	assert.ok(id, 'Bear : id is not defined');
	assert.ok(username, 'Bear : username is not defined');
	assert.ok(avatarId, 'Bear : avatarId is not defined');

	this.id =id;
	this.username = username;
	this.avatarId = avatarId;
};

module.exports = Bear;