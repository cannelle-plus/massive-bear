var assert = require('chai').assert;

// bearId : '4a82199e-7c30-4a66-b194-6d40127fbb89',
//       bearUsername : "jason",
// 			socialId : '24567789',
// 			avatarId : 23,
// 			hasSignedIn : false

var Bear = function(bearId, socialId, bearUsername, avatarId, hasSignedIn) {

	assert.ok(bearId, 'Bear : bearId is not defined');
	assert.ok(socialId, 'Bear : socialId is not defined');
	assert.ok(bearUsername, 'Bear : bearUsername is not defined');
	assert.ok(avatarId, 'Bear : avatarId is not defined');

	var _self = this;

	this.bearId =bearId;
	this.socialId = socialId;
	this.bearUsername = bearUsername;
	this.avatarId = avatarId;
	this.hasSignedIn = hasSignedIn;

	this.signIn = function(bearUsername,avatarId){
		_self.bearUsername = bearUsername;
		_self.avatarId = avatarId;
	};
	
};

module.exports = Bear;