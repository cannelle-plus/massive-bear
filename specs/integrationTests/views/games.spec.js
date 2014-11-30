/*jshint expr: true*/
var expect = require('chai').expect;
var currentPort = require('../../helper/currentPort.helper');
var ReturnDataGamesRepo = require('../../helper/returnDataGamesRepo.helper');
var authStaticUser = require('../../helper/authStaticUser.helper');
var oKDispatcher = require('../../helper/oKDispatcher.helper');
var gameDispatcher = oKDispatcher('game');
var TestData = require('../../helper/testData.helper');
var WebSocket = require('../../helper/webSocket.helper');

var Rx = require('rx');
var Q = require('q');
var request = require('supertest');

var CommandHandler = require('../../../src/commandHandler/commandHandler');
var GamesRoutes = require('../../../src/routes/gamesRoutes');
var App = require('../../../src/app');



describe('Given that we have a bear authentified, ', function() {
    it('when we get "/games", we receive the games.html file', function(done) {

        var testData = new TestData();
        var source = Rx.Observable.create(function(observer) {});

        var app = new App(source, authStaticUser(testData.bear.yoann), WebSocket);

        var gameRepo = new ReturnDataGamesRepo(testData.games);
        var commandHandler = new CommandHandler(gameDispatcher);
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

describe('Given that we have a bear not authentified, ', function() {
    it('when we get "/games", we receive a redirection to "/"', function(done) {
        
        var testData = new TestData();
        var source = Rx.Observable.create(function(observer) {});

        var app = new App(source, authStaticUser(), WebSocket);

        var gameRepo = new ReturnDataGamesRepo(testData.games);
        var commandHandler = new CommandHandler(gameDispatcher);
        var gameRoutes = new GamesRoutes(gameRepo, commandHandler);

        app.addHandlers(gameRoutes);

        request(app.start(currentPort()))
            .get('/games')
            .expect(302)
            .end(function(err, res) {
                expect(err).to.not.be.ok;
                expect(res.header.location).to.equal('/');
                done();
            });
    });
});

