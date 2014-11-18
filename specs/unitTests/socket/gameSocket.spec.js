/*jshint expr: true*/
var expect = require('chai').expect;
var ReturnDataGamesRepo = require('../../helper/returnDataGamesRepo.helper');
var msgDispatcher = require('../../helper/msgDispatcher.helper');
var TestData = require('../../helper/testData.helper');
var EventSender = require('../../helper/eventSender.helper');

var Rx = require('rx');

var Session = require('../../../src/eventListener/session');
var GamesRoutes = require('../../../src/routes/gamesRoutes');
var CommandHandler = require('../../../src/commandHandler/commandHandler');
var Session = require('../../../src/eventListener/session');

var FakeSocket = function(callBack) {
    this.emit = function() {
        callBack();
    };
};


describe('Given a bear is authentified', function() {

    it('when it requests the list of games, it subscribe to the gameJoined event associated with the list', function(done) {

        var testData = new TestData();

        var eventSender = new EventSender();
        var source = eventSender.source();

        var gameRepo = new ReturnDataGamesRepo(testData.games);
        var commandHandler = new CommandHandler(msgDispatcher('game'));
        var routes = new GamesRoutes(gameRepo, commandHandler);

        var session = new Session(testData.bear.yoann, source);

        var socket = new FakeSocket(function(evt) {
            done();
        });

        session.addSocket(socket);

        routes.list.execute(session)()
            .then(function(data) {
                eventSender.sendGameJoinedEvent(testData.games[0].id);
            });

    });
});

describe('Given a bear is authenticated and has requested a list of games', function() {

    var EXPECTED_TIMEOUT = 100;
    it('when a gameJoined event of another game is triggered, it does not trigger its subscription', function(done) {

        var testData = new TestData();

        var eventSender = new EventSender();
        var source = eventSender.source();

        var gameRepo = new ReturnDataGamesRepo(testData.games);
        var commandHandler = new CommandHandler(msgDispatcher('game'));
        var routes = new GamesRoutes(gameRepo, commandHandler);
        var evtTriggered = false;

        var session = new Session(testData.bear.yoann, source);
        var socket = new FakeSocket(function(evt) {
            done(new Error('Unexpected call'));
        });

        session.addSocket(socket);

        routes.list.execute(session)()
            .then(function(data) {
                eventSender.sendGameJoinedEvent('other id');
                evtTriggered = true;
            });

        this.timeout(EXPECTED_TIMEOUT + 100); // You add this to make sure mocha test timeout will only happen as a fail-over, when either of the functions haven't called done callback.
        var timeout = setTimeout(function(){
            if (evtTriggered) done();
        }, EXPECTED_TIMEOUT);

    });
});

describe('Given a bear is authenticated', function() {

    it('when it requests the list of games, it subscribe to the gameAbandonned event associated with the list', function(done) {

        var testData = new TestData();

        var eventSender = new EventSender();
        var source = eventSender.source();

        var gameRepo = new ReturnDataGamesRepo(testData.games);
        var commandHandler = new CommandHandler(msgDispatcher('game'));
        var routes = new GamesRoutes(gameRepo, commandHandler);

        var session = new Session(testData.bear.yoann, source);
        var socket = new FakeSocket(function(evt) {
            done();
        });

        session.addSocket(socket);

        routes.list.execute(session)()
            .then(function(data) {
                eventSender.sendGameAbandonnedEvent(testData.games[0].id);
            });

    });
});

describe('Given a bear is authenticated', function() {

    it('when it schedules a game, it subscribe to the gameScheduled event associated with the game it has just created', function(done) {

        var testData = new TestData();

        var eventSender = new EventSender();
        var source = eventSender.source();

        var gameRepo = new ReturnDataGamesRepo(testData.games);
        var commandHandler = new CommandHandler(msgDispatcher('game'));
        var routes = new GamesRoutes(gameRepo, commandHandler);

        var session = new Session(testData.bear.yoann, source);
        var socket = new FakeSocket(function(evt) {
            done();
        });

        session.addSocket(socket);
        var evt = testData.yoloEvents.gameScheduled.payLoad;

        routes.schedule.execute(session)(evt.id, evt.ownerId, evt.ownerUserName, evt.ownerId, evt.startDate, evt.location, evt.name, evt.nbPlayers)
            .then(function(data) {
                eventSender.sendGameScheduledEvent(evt.id);
            });

    });
});

