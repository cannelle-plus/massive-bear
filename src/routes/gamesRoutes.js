var assert = require('chai').assert;


var gamesRoutes = function(gameRepo, commandHandler) {

	assert.ok(gameRepo, 'gamesRoutes : gameRepo is not defined');
	assert.ok(commandHandler, 'gamesRoutes : commandHandler is not defined');

	var toJson = function(games) {
		return {
			gamesList: games
		};
	};

	this.games = {
		url: "/games",
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
					res.sendFile('games.html', options);
				} else {
					res.redirect(302, "/");
				}
			};
		}
	};

	var isInterestedInGames = function(session) {
		return function(games) {
			
			console.log(session);
			if (session){
				session.addSubscription(function(x,idx, obs) {
					for (var i = games.length - 1; i >= 0; i--) {
						if (x.Id == games[i].id) return true;
					}
					return false;
				});	
			}
			
			return games;
		};
	};

	var isInterestedInGame = function(session, gameId) {
		return function(data) {
			
			console.log('subscription');
			session.addSubscription(function(evt) {
				return evt.Id == gameId;
			});
			
			return data;
		};
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
				assert.ok(session, 'gamesRoutes : session is not defined');

				return gameRepo.getGames()
						.then(isInterestedInGames(session))
						.then(toJson);

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
			return {
				"And": function(fnExecute) {
					return fnExecute(id,  startDate, location, name, nbPlayersRequired);
				}
			};
		},
		execute: function(session) {
			return function(id,  startDate, location, name, nbPlayersRequired) {
				assert.ok(session, 'gamesRoutes : schedule : session is not defined');
				assert.ok(id, 'gamesRoutes : schedule :id is not defined');

				var currentBear = session.bear();

				var cmd = [
					name,
					currentBear.bearId,
					startDate + ':00.000',
					location,
					nbPlayersRequired
				];

				return commandHandler.handles("ScheduleGame", id, 0, currentBear, cmd)
						.then(isInterestedInGame(session, id));

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
				assert.ok(session, 'gamesRoutes : join: session is not defined');
				assert.ok(id, 'gamesRoutes : join: id is not defined');

				return commandHandler.handles("JoinGame", id, 0, session.bear(), []);

			};
		}
	};

	this.abandon = {
		url: "/api/game/abandon",
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
				assert.ok(session, 'gamesRoutes : abandon : session is not defined');
				assert.ok(id, 'gamesRoutes : abandon : id is not defined');

				return commandHandler.handles("AbandonGame", id, 0, session.bear(), []);
			};
		}
	};
};

module.exports = gamesRoutes;