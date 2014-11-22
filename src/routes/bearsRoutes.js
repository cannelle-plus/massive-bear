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
		url: "/api/bear/profile",
		verb: "POST",
		extract: function(req) {
			var profileId = req.body.payLoad.id;
			var profileUserName = req.body.payLoad.username;
			var profileAvatarId = req.body.payLoad.avatarId;

			return {
				"And": function(fnExecute) {
					return fnExecute(profileId, profileUserName, profileAvatarId);
				}
			};
		},
		execute: function(session) {
			return function(profileId, profileName, bearAvatarId) {
				assert.ok(session, 'bearsRoutes : session is not defined');
				assert.ok(profileId, 'bearsRoutes : profileId is not defined');
				assert.ok(profileName, 'bearsRoutes : profileName is not defined');
				assert.ok(bearAvatarId, 'bearsRoutes : bearAvatarId is not defined');

				var cmd = [
					profileName,
					bearAvatarId
				];

				return commandHandler.handles("SignIn", profileId, 0, session.user().id, session.user().username, cmd);

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

				return bearRepo.getBear(session.user().id)
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