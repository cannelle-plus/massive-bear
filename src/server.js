var env = require('node-env-file');
var express = require('express');
var Middleware = require('./routes/middleware');
var BearsRoutes = require('./routes/bearsRoutes');
var GamesRoutes = require('./routes/gamesRoutes');
var HomeRoutes = require('./routes/homeRoutes');
var Rx = require('rx');
var Q = require('q');
var App = require('./app');
var CommandHandler = require('./commandHandler/commandHandler');
var EventStore = require('./eventListener/eventStore');
var WookieDispatcher = require('./commandHandler/wookieDispatcher');
var socialAuth = require('./auth/socialAuth');
var WebSocket = require('./eventListener/webSocket');

var BearRepository = require('./repositories/bearRepository');
var GameRepository = require('./repositories/gameRepository');

var nodeEnv = process.env.NODE_ENV || "default";

console.log("We are currently landing off using '" + nodeEnv + "'' airways.");
env(__dirname + '/envs/' + nodeEnv + '.env');

//connecting to the event store to allow push notifications
var eventStore = new EventStore();
eventStore.connect();
var hot = eventStore.subscribe('$all');

//creating dispatcher for commands
var wookieDispatcher = new WookieDispatcher(process.env.wookieDispatcherHost, process.env.wookieDispatcherPort);

//creating repostiories to get data from db
var bearRepo = new BearRepository(process.env.connStringBear2Bear);
var gameRepo = new GameRepository(process.env.connStringBear2Bear);

var app = new App(hot, socialAuth(bearRepo), WebSocket);

//creating routes modules
var gameRoutes = new GamesRoutes(gameRepo, new CommandHandler(wookieDispatcher('game')));
var bearsRoutes = new BearsRoutes(bearRepo, new CommandHandler(wookieDispatcher('bear')));
var homeRoutes = new HomeRoutes();

//creating routes modules to the app
app.addHandlers(gameRoutes);
app.addHandlers(bearsRoutes);
app.addHandlers(homeRoutes);

var port = process.env.PORT || 8888;
// var port =  8888;

//toggling on the logs
app.toggleLog();

//starting the app
app.start(port);
console.log("magis is happening at Bassset Green Road " + port + ".");




