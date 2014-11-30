/*jshint expr: true*/
var expect = require('chai').expect;
var ReturnDataGamesRepo = require('../../helper/returnDataGamesRepo.helper');
var msgDispatcher = require('../../helper/msgDispatcher.helper');
var gameDispatcher = msgDispatcher('game');
var TestData = require('../../helper/testData.helper');

var Rx = require('rx');
var Q = require('q');

var GamesRoutes = require('../../../src/routes/gamesRoutes');
var CommandHandler = require('../../../src/commandHandler/commandHandler');
var Session = require('../../../src/eventListener/session');

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

describe('Given a bear is authentified, ', function() {

    it('when it requests the list of game, it receive the list of games', function(done) {

        var testData = new TestData();

        var gameRepo = new ReturnDataGamesRepo(testData.games);
        var commandHandler = new CommandHandler(gameDispatcher);
        var routes = new GamesRoutes(gameRepo, commandHandler);

        var source = Rx.Observable.create(function(observer) {});
        var session = new Session(testData.bear.yoann, source);

        routes.list.execute(session)()
            .then(function(data) {
                expect(JSON.stringify(data)).to.equal(JSON.stringify({
                    gamesList: testData.games
                }));
                done();
            });
    });
});


describe('Given a bear is not authentified, ', function() {

    it('when it requests its profile, it throws an exception ', function() {

        var testData = new TestData();

        var gameRepo = new ReturnDataGamesRepo(testData.games);
        var commandHandler = new CommandHandler(gameDispatcher);
        var routes = new GamesRoutes(gameRepo, commandHandler);

        var executingRouteWithNoSession = function() {
            routes.list.execute()();
        };

        expect(executingRouteWithNoSession).to.throw();

    });
});



describe('Given a bear is not authentified, ', function() {

    it('when it joins a game, it throws an exception ', function() {

        var testData = new TestData();

        var gameRepo = new ReturnDataGamesRepo(testData.games);
        var commandHandler = new CommandHandler(gameDispatcher);
        var routes = new GamesRoutes(gameRepo, commandHandler);

        var executingRouteWithNoSession = function() {
            routes.join.execute()(3);
        };

        expect(executingRouteWithNoSession).to.throw();

    });
});

describe('Given a bear is authentified, ', function() {

    it('when it join a game without gameId, it throws an exception', function() {

        var testData = new TestData();

        var gameRepo = new ReturnDataGamesRepo(testData.games);
        var commandHandler = new CommandHandler(gameDispatcher);
        var routes = new GamesRoutes(gameRepo, commandHandler);

        var source = Rx.Observable.create(function(observer) {});
        var session = new Session(testData.bear.yoann, source);

        var executingRouteWithNoArgs = function() {
            routes.join.execute(session)();
        };

        expect(executingRouteWithNoArgs).to.throw();
    });
});

describe('Given a bear is authentified, ', function() {

    it('when it joins a game, it dispatchs a message', function(done) {

        var testData = new TestData();

        var gameRepo = new ReturnDataGamesRepo(testData.games);
        var commandHandler = new CommandHandler(gameDispatcher);

        var routes = new GamesRoutes(gameRepo, commandHandler);

        var source = Rx.Observable.create(function(observer) {});
        var session = new Session(testData.bear.yoann, source);

        routes.join.execute(session)(3)
            .then(function(data) {
                try {
                    expect(data).to.be.ok;
                    expect(data.Id).to.equal(3);
                    expect(data.MetaData.UserId).to.equal(testData.bear.yoann.bearId);
                    expect(data.MetaData.UserName).to.equal(testData.bear.yoann.bearUsername);
                    expect(data.PayLoad.Case).to.equal("JoinGame");
                    expect(JSON.stringify(data.PayLoad.Fields)).to.equal(JSON.stringify([]));
                    done();
                } catch (e) {
                    console.log(e);
                }

            });
    });
});

describe('Given a bear is not authentified, ', function() {

    it('when it requests /api/game/abandon, it throws an exception ', function() {

        var testData = new TestData();

        var gameRepo = new ReturnDataGamesRepo(testData.games);
        var commandHandler = new CommandHandler(gameDispatcher);
        var routes = new GamesRoutes(gameRepo, commandHandler);

        var executingRouteWithNoSession = function() {
            routes.abandon.execute()(3);
        };

        expect(executingRouteWithNoSession).to.throw();

    });
});

describe('Given a bear is authentified, ', function() {

    it('when it abandons a game without gameId, it throws an exception', function() {

        var testData = new TestData();

        var gameRepo = new ReturnDataGamesRepo(testData.games);
        var commandHandler = new CommandHandler(gameDispatcher);
        var routes = new GamesRoutes(gameRepo, commandHandler);

        var source = Rx.Observable.create(function(observer) {});
        var session = new Session(testData.bear.yoann, source);

        var executingRouteWithNoArgs = function() {
            routes.abandon.execute(session)();
        };

        expect(executingRouteWithNoArgs).to.throw();
    });
});

describe('Given a bear is authentified, ', function() {

    it('when it abandons a game, it dispatchs a message', function(done) {

        var testData = new TestData();

        var gameRepo = new ReturnDataGamesRepo(testData.games);
        var commandHandler = new CommandHandler(gameDispatcher);

        var routes = new GamesRoutes(gameRepo, commandHandler);

        var source = Rx.Observable.create(function(observer) {});
        var session = new Session(testData.bear.yoann, source);

        routes.abandon.execute(session)(3)
            .then(function(data) {
                try {
                    expect(data).to.be.ok;
                    expect(data.Id).to.equal(3);
                    expect(data.MetaData.UserId).to.equal(testData.bear.yoann.bearId);
                    expect(data.MetaData.UserName).to.equal(testData.bear.yoann.bearUsername);
                    expect(data.PayLoad.Case).to.equal("AbandonGame");
                    expect(JSON.stringify(data.PayLoad.Fields)).to.equal(JSON.stringify([]));
                    done();
                } catch (err) {
                    console.log(err);
                }

            });
    });
});