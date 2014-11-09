var assert = require('chai').assert;


var gamesRoutes = function(gameRepo, commandHandler) {

	assert.ok(gameRepo, 'gamesRoutes : gameRepo is not defined');
	assert.ok(commandHandler, 'gamesRoutes : commandHandler is not defined');



	var toJson = function(games) {
		return {
			gamesList: games
		};
	};

	// var writeError = function(err) {
	// 	console.log(err);
	// };

	this.games = {
		url: "/games",
		verb: "GET",
		extract: function() {},
		execute: function() {},
		handles: function(req, res) {
			var options = {
				root: './www-root/',
				dotfiles: 'deny',
				headers: {
					'x-timestamp': Date.now(),
					'x-sent': true
				}
			};
			res.sendFile('games.html', options);
		}
	};

	this.list = {
		url: "/api/game/list",
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

				return gameRepo.getGames().then(toJson);

			};
		}
	};

	this.schedule = {
		url: "/api/game/schedule",
		verb: "POST",
		extract: function(req) {
			var id = req.body.payLoad.id;
			var startDate = req.body.payLoad.startDate;
			var location = req.body.payLoad.location;
			var name = req.body.payLoad.name;
			var nbPlayersRequired = req.body.payLoad.maxPlayers;
			var ownerId = req.user.id;
			var userId = req.user.id;
			var userName = req.user.username;
			return {
				"And": function(fnExecute) {
					return fnExecute(id, userId, userName, ownerId, startDate, location, name, nbPlayersRequired);
				}
			};
		},
		execute: function(session) {
			return function(id, userId, userName, ownerId, startDate, location, name, nbPlayersRequired) {
				assert.ok(session, 'bearsRoutes : session is not defined');
				assert.ok(id, 'bearsRoutes : id is not defined');

				var cmd = [
					name,
					ownerId,
					startDate,
					location,
					nbPlayersRequired
				];

				return commandHandler.handles("JoinGame", id, 0, session.user().id, session.user().username, cmd);

			};
		}
	};

	this.join = {
		url: "/api/game/join",
		verb: "POST",
		extract: function(req) {
			var gameId = req.body.payLoad.id;
			return {
				"And": function(fnExecute) {
					return fnExecute(gameId);
				}
			};
		},
		execute: function(session) {
			return function(id) {
				assert.ok(session, 'bearsRoutes : session is not defined');
				assert.ok(id, 'bearsRoutes : id is not defined');

				return commandHandler.handles("JoinGame", id, 0, session.user().id, session.user().username, []);

			};
		}
	};

	this.abandon = {
		url: "/api/game/abandon",
		verb: "POST",
		extract: function(req) {
			return {
				"And": function(fnExecute) {
					return fnExecute();
				}
			};
		},
		execute: function(session) {
			return function(id) {
				assert.ok(session, 'bearsRoutes : session is not defined');
				assert.ok(id, 'bearsRoutes : id is not defined');

				return commandHandler.handles("AbandonGame", id, 0, session.user().id, session.user().username, []);
			};
		}
	};
};

module.exports = gamesRoutes;