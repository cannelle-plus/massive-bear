var assert = require('chai').assert;
var profileIdParam = require('./profileIdParam');

var bearsRoutes = function(bearRepo) {

	assert.ok(bearRepo, 'bearsRoutes : bearRepo is not defined');


	var toJson = function(user) {
		return {
			bear: user
		};
	};

	var writeError = function(err) {
		console.log(err);
	};

	
	this.saveProfile = {
		url : "/api/bear/profile",
		verb: "POST",
		extract : function(req){
			return { "And" : function(fnExecute){
				return fnExecute();
			}};
		},
		execute : function(session) {
			return function(profileName, bearImageId) {
				assert.ok(session, 'bearsRoutes : session is not defined');
				assert.ok(session, 'bearsRoutes : profileName is not defined');
				assert.ok(session, 'bearsRoutes : bearImageId is not defined');


				return bearRepo.saveProfile(session.user().id, profileName, bearImageId);

			};
		}
	};

	this.profile = {
		url : "/api/bear/profile",
		params : [profileIdParam],
		verb: "GET",
		extract : function(req){
			return { "And" : function(fnExecute){
				return fnExecute();
			}};
		},
		execute : function(session) {
			return function() {
				assert.ok(session, 'bearsRoutes : session is not defined');

				return bearRepo.getBear(session.user().id)
					           .then(toJson);

			};
		}
	};

	this.profileOtherUser = {
		url : "/api/bear/profile/:profileId",
		params : [profileIdParam],
		verb: "GET",
		extract : function(req){
			var profileId = req.profileId;
			return { "And" : function(fnExecute){
				return fnExecute(profileId);
			}};
		},
		execute : function(session) {
			return function(profileId) {
				assert.ok(session, 'bearsRoutes : session is not defined');

				return bearRepo.getBear(profileId)
					           .then(toJson);

			};
		}
	};
};

module.exports = bearsRoutes;