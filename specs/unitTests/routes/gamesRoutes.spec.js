/*jshint expr: true*/
var expect = require('chai').expect;
var GamesRoutes = require('../../../src/routes/gamesRoutes');
var CommandHandler = require('../../../src/dispatcher/commandHandler');
var Session = require('../../../src/listenner/session');
var Rx = require('rx');
var sinon = require('sinon');
var Q = require('q');


var FakeGameRepo = function(data) {

    this.getGames = function() {
        var deferred = Q.defer();
        setTimeout(function() {
            deferred.resolve(data);
        }, 1);
        return deferred.promise;
    };
};

var fakeDispatcher = function(aggRoot, id, msg) {
    var deferred = Q.defer();
    setTimeout(function() {
        deferred.resolve(msg);
    }, 1);
    return deferred.promise;
};

var games = [{
    id: '4a82199e-7c30-4a95-b194-6d40127fbb89',
    version: 1,
    name: "test",
    ownerId: 1,
    ownerUserName: "julien",
    startDate: "10/01/2014 10:00",
    location: "playSoccer",
    players: "julien,yoann",
    nbPlayers: 2,
    maxPlayers: 8
}, {
    id: 'd70efb73-8c6c-4106-97dd-7503bbf7f5fd',
    version: 1,
    name: "Joga Bonito",
    ownerId: 1,
    ownerUserName: "julien",
    startDate: "10/01/2014 19:00",
    location: "playSoccer",
    players: "julien,yoann",
    nbPlayers: 7,
    maxPlayers: 8
}];

describe('Given nothing, ', function() {

    it('when we create a gamesRoutes, it needs a gameRepository and a commandHandler', function() {

        var fnCreateGamesRoutes = function() {
            return new GamesRoutes();
        };
        expect(fnCreateGamesRoutes).to.throw();

        var fnCreateGamesRoutesWithRepoOnly = function() {
            return new GamesRoutes({});
        };
        expect(fnCreateGamesRoutesWithRepoOnly).to.throw();

        var routes = new GamesRoutes({}, {});

        expect(routes).to.be.ok;

    });
});

describe('Given a user is authenticated, ', function() {

    it('when it requests /api/game/list, it receive the list of games', function(done) {

        var user = {
            id: 7,
            username: 'yoann'
        };

        var gameRepo = new FakeGameRepo(games);
        var commandHandler = new CommandHandler('game', fakeDispatcher);
        var routes = new GamesRoutes(gameRepo, commandHandler);

        var source = Rx.Observable.create(function(observer) {});
        var session = new Session(user, source);

        routes.list.execute(session)()
            .then(function(data) {
                var expected = {
                    gamesList: games
                };
                expect(JSON.stringify(data)).to.equal(JSON.stringify(expected));
                done();
            });
    });
});


describe('Given a user is not authenticated, ', function() {

    it('when it requests /api/bear/profile, it throws an exception ', function() {

        var gameRepo = new FakeGameRepo(games);
        var commandHandler = new CommandHandler('game', fakeDispatcher);
        var routes = new GamesRoutes(gameRepo, commandHandler);

        var executingRouteWithNoSession = function() {
            routes.list.execute()();
        };

        expect(executingRouteWithNoSession).to.throw();

    });
});



describe('Given a user is not authenticated, ', function() {

    it('when it requests /api/game/join, it throws an exception ', function() {

        var gameRepo = new FakeGameRepo(games);
        var commandHandler = new CommandHandler('game', fakeDispatcher);
        var routes = new GamesRoutes(gameRepo, commandHandler);

        var executingRouteWithNoSession = function() {
            routes.join.execute()(3);
        };

        expect(executingRouteWithNoSession).to.throw();

    });
});

describe('Given a user is authenticated, ', function() {

    it('when it requests /api/game/join without gameId, it throws an exception', function() {

        var user = {
            id: 7,
            username: 'yoann'
        };

        var gameRepo = new FakeGameRepo(games);
        var commandHandler = new CommandHandler('game', fakeDispatcher);
        var routes = new GamesRoutes(gameRepo, commandHandler);

        var source = Rx.Observable.create(function(observer) {});
        var session = new Session(user, source);

        var executingRouteWithNoArgs = function() {
            routes.join.execute(session)();
        };

        expect(executingRouteWithNoArgs).to.throw();
    });
});

describe('Given a user is authenticated, ', function() {

    it('when it requests /api/game/join, it generates a message , it sends to the dispatcher', function(done) {

        var user = {
            id: 7,
            username: 'yoann'
        };

        var gameRepo = new FakeGameRepo(games);
        var commandHandler = new CommandHandler('game', fakeDispatcher);

        var routes = new GamesRoutes(gameRepo, commandHandler);

        var source = Rx.Observable.create(function(observer) {});
        var session = new Session(user, source);

        routes.join.execute(session)(3)
            .then(function(data) {
                try {
                    expect(data).to.be.ok;
                    expect(data.Id).to.equal(3);
                    expect(data.MetaData.UserId).to.equal(7);
                    expect(data.MetaData.UserName).to.equal("yoann");
                    expect(data.PayLoad.Case).to.equal("JoinGame");
                    expect(JSON.stringify(data.PayLoad.Fields)).to.equal(JSON.stringify([]));
                    done();
                } catch (err) {
                    console.log(err);
                }

            });
    });
});

describe('Given a user is not authenticated, ', function() {

    it('when it requests /api/game/abandon, it throws an exception ', function() {

        var gameRepo = new FakeGameRepo(games);
        var commandHandler = new CommandHandler('game', fakeDispatcher);
        var routes = new GamesRoutes(gameRepo, commandHandler);

        var executingRouteWithNoSession = function() {
            routes.abandon.execute()(3);
        };

        expect(executingRouteWithNoSession).to.throw();

    });
});

describe('Given a user is authenticated, ', function() {

    it('when it requests /api/game/abandon without gameId, it throws an exception', function() {

        var user = {
            id: 7,
            username: 'yoann'
        };

        var gameRepo = new FakeGameRepo(games);
        var commandHandler = new CommandHandler('game', fakeDispatcher);
        var routes = new GamesRoutes(gameRepo, commandHandler);

        var source = Rx.Observable.create(function(observer) {});
        var session = new Session(user, source);

        var executingRouteWithNoArgs = function() {
            routes.abandon.execute(session)();
        };

        expect(executingRouteWithNoArgs).to.throw();
    });
});

describe('Given a user is authenticated, ', function() {

    it('when it requests /api/game/abandon, it generates a message , it sends to the dispatcher', function(done) {

        var user = {
            id: 7,
            username: 'yoann'
        };

        var gameRepo = new FakeGameRepo(games);
        var commandHandler = new CommandHandler('game', fakeDispatcher);

        var routes = new GamesRoutes(gameRepo, commandHandler);

        var source = Rx.Observable.create(function(observer) {});
        var session = new Session(user, source);

        routes.abandon.execute(session)(3)
            .then(function(data) {
                try {
                    expect(data).to.be.ok;
                    expect(data.Id).to.equal(3);
                    expect(data.MetaData.UserId).to.equal(7);
                    expect(data.MetaData.UserName).to.equal("yoann");
                    expect(data.PayLoad.Case).to.equal("AbandonGame");
                    expect(JSON.stringify(data.PayLoad.Fields)).to.equal(JSON.stringify([]));
                    done();
                } catch (err) {
                    console.log(err);
                }

            });
    });
});