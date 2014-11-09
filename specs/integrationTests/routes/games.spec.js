/*jshint expr: true*/
var expect = require('chai').expect;
var CommandHandler = require('../../../src/dispatcher/commandHandler');
var GamesRoutes = require('../../../src/routes/gamesRoutes');
var Rx = require('rx');
var App = require('../../../src/app');
var Q = require('q');


var request = require('supertest');

var port = 8380;

var currentPort = function() {
    port = port + 1;
    return port;
};

var FakeGameRepo = function(data) {

    this.getGames = function() {
        var deferred = Q.defer();
        setTimeout(function() {
            deferred.resolve(data);
        }, 1);
        return deferred.promise;
    };
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
    maxPlayers: 9
}];

var fakeDispatcher = function(aggRoot, id, msg) {
    var deferred = Q.defer();
    setTimeout(function() {
        deferred.resolve({ responseFromTheDispatcher: "OK" });
    }, 1);
    return deferred.promise;
};

describe('Given that we have a user authentified, ', function() {
    it('when we get "/api/game/list", we receive the list of games', function(done) {

        var source = Rx.Observable.create(function(observer) {});

        var user = {
            id: 7,
            username: 'yoann'
        };

        var app = new App(source);

        var gameRepo = new FakeGameRepo(games);
        var commandHandler = new CommandHandler('game', fakeDispatcher);
        var gameRoutes = new GamesRoutes(gameRepo, commandHandler);

        app.addHandlers(gameRoutes);
        app.addUserLoggedin(user);
        
        request(app.start(currentPort()))
            .get('/api/game/list')
            .expect(200)
            .end(function(err, res) {
                expect(err).to.not.be.ok;
                expect(res.text).to.equal(JSON.stringify({
                    gamesList: games
                }));
                done();
            });
    });
});

describe('Given that we have a user not authentified, ', function() {
    it('when we get "/api/game/list", we receive an unauthentified response 401', function(done) {

        var source = Rx.Observable.create(function(observer) {});

        var user = {
            id: 7,
            username: 'yoann'
        };

        var app = new App(source);

        var gameRepo = new FakeGameRepo(games);
        var commandHandler = new CommandHandler('game', fakeDispatcher);
        var gameRoutes = new GamesRoutes(gameRepo, commandHandler);

        app.addHandlers(gameRoutes);
        app.addUserLoggedin(user);
        
        request(app.start(currentPort()))
            .get('/api/game/list')
            .expect(401)
            .end(function(err, res) {
                done();
            });
    });
});

describe('Given that we have a user authentified, ', function() {
    it('when we get "/games", we receive the games.html file', function(done) {

        var source = Rx.Observable.create(function(observer) {});

        var user = {
            id: 7,
            username: 'yoann'
        };

        var app = new App(source);

        var gameRepo = new FakeGameRepo(games);
        var commandHandler = new CommandHandler('game', fakeDispatcher);
        var gameRoutes = new GamesRoutes(gameRepo, commandHandler);

        app.addHandlers(gameRoutes);
        app.addUserLoggedin(user);
        
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

describe('Given that we have a user authentified, ', function() {
    it('when we post "/api/game/join", we dispatch a command ', function(done) {

        var source = Rx.Observable.create(function(observer) {});

        var user = {
            id: 7,
            username: 'yoann'
        };

        var postMessage = {
            evtType: "GameJoined",
            payLoad: {
                "id": 'd70efb73-8c6c-4106-97dd-7503bbf7f5fd',
                "version": 2,
                "username": "tom",
                "nbPlayers": 3
            }
        };

        var app = new App(source);

        var gameRepo = new FakeGameRepo(games);
        var commandHandler = new CommandHandler('game', fakeDispatcher);
        var gameRoutes = new GamesRoutes(gameRepo, commandHandler);

        app.addHandlers(gameRoutes);
        app.addUserLoggedin(user);
        
        request(app.start(currentPort()))
            .post('/api/game/join')
            .send(postMessage)
            .expect(200)
            .end(function(err, res) {
                expect(err).to.not.be.ok;
                expect(res.text).to.equal(JSON.stringify({ responseFromTheDispatcher: "OK" }));
                done();
            });
    });
});

describe('Given that we have a user not authentified, ', function() {
    it('when we post "/api/game/join", we receive an unauthorized  response 401 ', function(done) {

        var source = Rx.Observable.create(function(observer) {});

        var user = {
            id: 7,
            username: 'yoann'
        };

        var postMessage = {
            evtType: "GameJoined",
            payLoad: {
                "id": 'd70efb73-8c6c-4106-97dd-7503bbf7f5fd',
                "version": 2,
                "username": "tom",
                "nbPlayers": 3
            }
        };

        var app = new App(source);

        var gameRepo = new FakeGameRepo(games);
        var commandHandler = new CommandHandler('game', fakeDispatcher);
        var gameRoutes = new GamesRoutes(gameRepo, commandHandler);

        app.addHandlers(gameRoutes);
        
        request(app.start(currentPort()))
            .post('/api/game/join')
            .send(postMessage)
            .expect(401)
            .end(function(err, res) {
                expect(err).to.not.be.ok;
                done();
            });
    });
});

describe('Given that we have a user  authentified, ', function() {
    it('when we post "/api/game/schedule", we dispatch a command ', function(done) {

        var source = Rx.Observable.create(function(observer) {});

        var user = {
            id: 7,
            username: 'yoann'
        };

        var postMessage = {
            evtType: "GameScheduled",
            payLoad: {
                "id" : 'd70efb73-8c6c-4106-97dd-7503bbf7f5bb', 
                name : 'gameName', 
                ownerId : 24,
                ownerUserName : 'tom',
                startDate : '01/12/2015 10:00',
                location: 'Toulouse', 
                players : ['tom'],
                nbPlayers : 1,
                maxPlayers : 10
            }
        };

        var app = new App(source);

        var gameRepo = new FakeGameRepo(games);
        var commandHandler = new CommandHandler('game', fakeDispatcher);
        var gameRoutes = new GamesRoutes(gameRepo, commandHandler);

        app.addHandlers(gameRoutes);
        app.addUserLoggedin(user);
        
        request(app.start(currentPort()))
            .post('/api/game/schedule')
            .send(postMessage)
            .expect(200)
            .end(function(err, res) {
                expect(err).to.not.be.ok;
                expect(res.text).to.equal(JSON.stringify({ responseFromTheDispatcher: "OK" }));
                done();
            });
    });
});

describe('Given that we have a user not authentified, ', function() {
    it('when we post "/api/game/schedule", we receive an unauthorized response 401 ', function(done) {

        var source = Rx.Observable.create(function(observer) {});

        var user = {
            id: 7,
            username: 'yoann'
        };

        var postMessage = {
            evtType: "GameScheduled",
            payLoad: {
                "id" : 'd70efb73-8c6c-4106-97dd-7503bbf7f5bb', 
                name : 'gameName', 
                ownerId : 24,
                ownerUserName : 'tom',
                startDate : '01/12/2015 10:00',
                location: 'Toulouse', 
                players : ['tom'],
                nbPlayers : 1,
                maxPlayers : 10
            }
        };

        var app = new App(source);

        var gameRepo = new FakeGameRepo(games);
        var commandHandler = new CommandHandler('game', fakeDispatcher);
        var gameRoutes = new GamesRoutes(gameRepo, commandHandler);

        app.addHandlers(gameRoutes);
        
        request(app.start(currentPort()))
            .post('/api/game/schedule')
            .send(postMessage)
            .expect(401)
            .end(function(err, res) {
                expect(err).to.not.be.ok;
                done();
            });
    });
});