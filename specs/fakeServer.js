var express = require('express');
var Middleware = require('../src/routes/middleware');
var BearsRoutes = require('../src/routes/bearsRoutes');
var GamesRoutes = require('../src/routes/gamesRoutes');
var Rx = require('rx');
var Q = require('q');
var App = require('../src/app');
var CommandHandler = require('../src/commandHandler/commandHandler');

var authStaticUser = require('./helper/authStaticUser.helper');

var yoann = {
    id: 7,
    username: 'yoann'
};

var julien = {
    id: 8,
    username: 'julien'
};

var FakeBearRepo = function(data) {

    this.getBear = function(id) {
        var deferred = Q.defer();
        setTimeout(function() {
            deferred.resolve(data['bear' + id]);
        }, 1);
        return deferred.promise;
    };
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

var fakeDispatcher = function(aggRoot) {
    return function(id, msg) {
        var deferred = Q.defer();
        setTimeout(function() {
            deferred.resolve({
                responseFromTheDispatcher: "OK"
            });
        }, 1);
        return deferred.promise;
    };
};

var source = Rx.Observable.create(function(observer) {});

var app = new App(source, authStaticUser(yoann));

var gameRepo = new FakeGameRepo(games);
var commandHandler = new CommandHandler(fakeDispatcher('game'));
var gameRoutes = new GamesRoutes(gameRepo, commandHandler);

app.addHandlers(gameRoutes);

var port = 8380;

app.toggleLog();

app.start(port);
console.log("magis is happening at Bassset Green Road " + port + ".");
