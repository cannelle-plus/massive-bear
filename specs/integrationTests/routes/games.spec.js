/*jshint expr: true*/
var expect = require('chai').expect;
var CommandHandler = require('../../../src/commandHandler/commandHandler');
var oKDispatcher = require('../../../src/commandHandler/oKDispatcher');
var ReturnDataGamesRepo = require('../../../src/repositories/returnDataGamesRepo');
var GamesRoutes = require('../../../src/routes/gamesRoutes');
var currentPort = require('../currentPort');
var Rx = require('rx');
var App = require('../../../src/app');
var authStaticUser = require('../../../src/auth/authStaticUser');
var Q = require('q');
var request = require('supertest');
var TestData = require('../../testData');



describe('Given that we have a bear authentified, ', function() {
    it('when we get "/api/game/list", we receive the list of games', function(done) {

        var testData = new TestData();
        var source = Rx.Observable.create(function(observer) {});

        var app = new App(source, authStaticUser(testData.bear.yoann));

        var gameRepo = new ReturnDataGamesRepo(testData.games);
        var commandHandler = new CommandHandler('game', oKDispatcher);
        var gameRoutes = new GamesRoutes(gameRepo, commandHandler);

        app.addHandlers(gameRoutes);

        request(app.start(currentPort()))
            .get('/api/game/list')
            .expect(200)
            .end(function(err, res) {
                expect(err).to.not.be.ok;
                expect(res.text).to.equal(JSON.stringify({
                    gamesList: testData.games
                }));
                done();
            });
    });
});

describe('Given that we have a bear not authentified, ', function() {
    it('when we get "/api/game/list", we receive an unauthentified response 401', function(done) {

        var testData = new TestData();
        var source = Rx.Observable.create(function(observer) {});

        var app = new App(source, authStaticUser(testData.bear.yoann));

        var gameRepo = new ReturnDataGamesRepo(testData.games);
        var commandHandler = new CommandHandler('game', oKDispatcher);
        var gameRoutes = new GamesRoutes(gameRepo, commandHandler);

        app.addHandlers(gameRoutes);

        request(app.start(currentPort()))
            .get('/api/game/list')
            .expect(401)
            .end(function(err, res) {
                done();
            });
    });
});

describe('Given that we have a bear authentified, ', function() {
    it('when we get "/games", we receive the games.html file', function(done) {

        var testData = new TestData();
        var source = Rx.Observable.create(function(observer) {});

        var app = new App(source, authStaticUser(testData.bear.yoann));

        var gameRepo = new ReturnDataGamesRepo(testData.games);
        var commandHandler = new CommandHandler('game', oKDispatcher);
        var gameRoutes = new GamesRoutes(gameRepo, commandHandler);

        app.addHandlers(gameRoutes);

        request(app.start(currentPort()))
            .get('/games')
            .expect(200)
            .end(function(err, res) {
                expect(err).to.not.be.ok;
                expect(res.header['content-type']).to.equal('text/html; charset=UTF-8');
                done();
            });
    });
});

describe('Given that we have a bear authentified, ', function() {
    it('when we post "/api/game/join", we dispatch a command ', function(done) {

        var testData = new TestData();
        var source = Rx.Observable.create(function(observer) {});

        var app = new App(source, authStaticUser(testData.bear.yoann));

        var gameRepo = new ReturnDataGamesRepo(testData.games);
        var commandHandler = new CommandHandler('game', oKDispatcher);
        var gameRoutes = new GamesRoutes(gameRepo, commandHandler);

        app.addHandlers(gameRoutes);

        request(app.start(currentPort()))
            .post('/api/game/join')
            .send(testData.yoloEvents.gameJoined)
            .expect(200)
            .end(function(err, res) {
                expect(err).to.not.be.ok;
                expect(res.text).to.equal(JSON.stringify(testData.responseFromTheDispatcher));
                done();
            });
    });
});

describe('Given that we have a bear not authentified, ', function() {
    it('when we post "/api/game/join", we receive an unauthorized  response 401 ', function(done) {

        var testData = new TestData();
        var source = Rx.Observable.create(function(observer) {});

        var app = new App(source, authStaticUser());

        var gameRepo = new ReturnDataGamesRepo(testData.games);
        var commandHandler = new CommandHandler('game', oKDispatcher);
        var gameRoutes = new GamesRoutes(gameRepo, commandHandler);

        app.addHandlers(gameRoutes);

        request(app.start(currentPort()))
            .post('/api/game/join')
            .send(testData.yoloEvents.gameJoined)
            .expect(401)
            .end(function(err, res) {
                expect(err).to.not.be.ok;
                done();
            });
    });
});

describe('Given that we have a bear  authentified, ', function() {
    it('when we post "/api/game/schedule", we dispatch a command ', function(done) {

        var testData = new TestData();
        var source = Rx.Observable.create(function(observer) {});

        var app = new App(source, authStaticUser(testData.bear.yoann));

        var gameRepo = new ReturnDataGamesRepo(testData.games);
        var commandHandler = new CommandHandler('game', oKDispatcher);
        var gameRoutes = new GamesRoutes(gameRepo, commandHandler);

        app.addHandlers(gameRoutes);

        request(app.start(currentPort()))
            .post('/api/game/schedule')
            .send(testData.yoloEvents.gameScheduled)
            .expect(200)
            .end(function(err, res) {
                expect(err).to.not.be.ok;
                expect(res.text).to.equal(JSON.stringify(testData.responseFromTheDispatcher));
                done();
            });
    });
});

describe('Given that we have a bear not authentified, ', function() {
    it('when we post "/api/game/schedule", we receive an unauthorized response 401 ', function(done) {

        var testData = new TestData();
        var source = Rx.Observable.create(function(observer) {});

        var app = new App(source, authStaticUser());

        var gameRepo = new ReturnDataGamesRepo(testData.games);
        var commandHandler = new CommandHandler('game', oKDispatcher);
        var gameRoutes = new GamesRoutes(gameRepo, commandHandler);

        app.addHandlers(gameRoutes);

        request(app.start(currentPort()))
            .post('/api/game/schedule')
            .send(testData.yoloEvents.gameScheduled)
            .expect(401)
            .end(function(err, res) {
                expect(err).to.not.be.ok;
                done();
            });
    });
});

describe('Given that we have a bear  authentified, ', function() {
    it('when we post "/api/game/abandon", we dispatch a command ', function(done) {

        var testData = new TestData();
        var source = Rx.Observable.create(function(observer) {});

        
        var app = new App(source, authStaticUser(testData.bear.yoann));

        var gameRepo = new ReturnDataGamesRepo(testData.games);
        var commandHandler = new CommandHandler('game', oKDispatcher);
        var gameRoutes = new GamesRoutes(gameRepo, commandHandler);

        app.addHandlers(gameRoutes);

        request(app.start(currentPort()))
            .post('/api/game/abandon')
            .send(testData.yoloEvents.gameAbandonned)
            .expect(200)
            .end(function(err, res) {
                expect(err).to.not.be.ok;
                expect(res.text).to.equal(JSON.stringify(testData.responseFromTheDispatcher));
                done();
            });
    });
});

describe('Given that we have a bear  not authentified, ', function() {
    it('when we post "/api/game/abandon", we dispatch a command ', function(done) {

        var testData = new TestData();
        var source = Rx.Observable.create(function(observer) {});

        var app = new App(source, authStaticUser());

        var gameRepo = new ReturnDataGamesRepo(testData.games);
        var commandHandler = new CommandHandler('game', oKDispatcher);
        var gameRoutes = new GamesRoutes(gameRepo, commandHandler);

        app.addHandlers(gameRoutes);

        request(app.start(currentPort()))
            .post('/api/game/abandon')
            .send(testData.yoloEvents.gameAbandonned)
            .expect(401)
            .end(function(err, res) {
                expect(err).to.not.be.ok;
                done();
            });
    });
});