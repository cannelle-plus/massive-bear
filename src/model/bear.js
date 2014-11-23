var assert = require('chai').assert;

var Bear = function(id, userId, username, avatarId) {

	assert.ok(id, 'Bear : id is not defined');
	assert.ok(userId, 'Bear : userId is not defined');
	assert.ok(username, 'Bear : username is not defined');
	assert.ok(avatarId, 'Bear : avatarId is not defined');

	this.id =id;
	this.userId = userId;
	this.username = username;
	this.avatarId = avatarId;
};

module.exports = Bear;