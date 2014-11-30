var assert = require('chai').assert;
var profileIdParam = require('./profileIdParam');

var bearsRoutes = function(bearRepo, commandHandler) {

	assert.ok(bearRepo, 'bearsRoutes : bearRepo is not defined');
	assert.ok(commandHandler, 'bearsRoutes : commandHandler is not defined');

	var toJson = function(user) {
		return {
			bear: user
		};
	};

	var writeError = function(err) {
		console.log(err);
	};

	this.signin = {
		url: "/signin",
		verb: "GET",
		extract: function() {},
		execute: function() {},
		handles: function(session) {
			return function(req, res) {
				
				if (session) {
					var options = {
						root: './www-root/',
						dotfiles: 'deny',
						headers: {
							'x-timestamp': Date.now(),
							'x-sent': true
						}
					};
					res.sendFile("signin.html", options);
				} else {
					res.redirect(302,"/");
				}
			};
		}
	};


	this.saveProfile = { 
		url: "/api/bear/signin",
		verb: "POST",
		extract: function(req) {
			var bearUsername = req.body.bearUsername;
			var avatarId = req.body.avatarId;				
			return {
				"And": function(fnExecute) {
					return fnExecute(bearUsername,avatarId);
				}
			};
		},
		execute: function(session) { 
			return function(bearUsername,avatarId) {

				var currentBear = session.bear();

				currentBear.signIn(bearUsername,avatarId);

				var cmd = [
					bearUsername,
					avatarId
				];

				//dispatch the command to the wookie
				return commandHandler.handles("SignIn", currentBear.bearId, 0, currentBear, cmd);
				
			};
		}
	};

	this.profile = {
		url: "/api/bear/profile",
		params: [profileIdParam],
		verb: "GET",
		extract: function(req) {
			return {
				"And": function(fnExecute) {
					return fnExecute();
				}
			};
		},
		execute: function(session) {
			return function() {
				assert.ok(session, 'bearsRoutes : session is not defined');

				return bearRepo.getBear(session.bear().userId)
					.then(toJson);

			};
		}
	};

	this.profileOtherUser = {
		url: "/api/bear/profile/:profileId",
		params: [profileIdParam],
		verb: "GET",
		extract: function(req) {
			var profileId = req.profileId;
			return {
				"And": function(fnExecute) {
					return fnExecute(profileId);
				}
			};
		},
		execute: function(session) {
			return function(profileId) {
				assert.ok(session, 'bearsRoutes : session is not defined');

				return bearRepo.getBear(profileId)
					.then(toJson);

			};
		}
	};
};

module.exports = bearsRoutes;