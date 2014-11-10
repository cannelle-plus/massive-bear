var env = require('node-env-file');
var express = require('express');
var Middleware = require('./routes/middleware');
var BearsRoutes = require('./routes/bearsRoutes');
var GamesRoutes = require('./routes/gamesRoutes');
var Rx = require('rx');
var Q = require('q');
var App = require('./app');
var CommandHandler = require('./dispatcher/commandHandler');
var EventStore = require('./listenner/eventStore');

console.log("We are currently landing off using '" + process.env.NODE_ENV + "'' airways.");
env(__dirname + '/envs/' + process.env.NODE_ENV + '.env');

//connecting to the event store to allow push notifications
var eventStore = new EventStore();
eventStore.connect();

var app = new App(eventStore);

//creating dispatcher for commands
var wookieDispatcher = new require('./dispatcher/wookie')(process.env.wookieHost, process.env.wookiePort);

//creating repostiories to get data from db
var bearRepo = require('./repositories/bearRepository')(process.env.connStringBear2Bear);
var gameRepo = require('./repositories/gameRepository')(process.env.connStringBear2Bear);

//creating command handler for commands
var wookieCommandHandler = new CommandHandler('game', wookieDispatcher);

//creating routes modules
var gameRoutes = new GamesRoutes(gameRepo, wookieCommandHandler);
var bearsRoutes = new BearsRoutes(bearRepo);

//creating routes modules to the app
app.addHandlers(gameRoutes);
app.addHandlers(bearsRoutes);

var port = 8380;

//toggling on the logs
app.toggleLog();

//starting the app
app.start(port);
console.log("magis is happening at Bassset Green Road " + port + ".");