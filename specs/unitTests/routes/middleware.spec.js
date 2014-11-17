/*jshint expr: true*/
var expect = require('chai').expect;
var Middleware = require('../../../src/routes/middleware');
var CommandHandler = require('../../../src/commandHandler/commandHandler');
var GamesRoutes = require('../../../src/routes/gamesRoutes');
var BearsRoutes = require('../../../src/routes/bearsRoutes');
var ProfileIdParam = require('../../../src/routes/profileIdParam');
var Rx = require('rx');
var TestData = require('../../testData');
var ReturnDataGamesRepo = require('../../../src/repositories/returnDataGamesRepo');
var msgDispatcher = require('../../../src/commandHandler/msgDispatcher');


var FakeApp = function() {
	var _postRoutes = [];
	var _getRoutes = [];
	var _params = [];

	this.postRoutes = function() {
		return _postRoutes;
	};

	this.getRoutes = function() {
		return _getRoutes;
	};

	this.params = function() {
		return _params;
	};

	this.post = function(r) {
		_postRoutes.push(r);
	};

	this.get = function(r) {
		_getRoutes.push(r);
	};

	this.param = function(p) {
		_params.push(p);
	};
};


describe('Given nothing, ', function() {

	it('when we create a Middleware, it needs a web application to assign its middleware to and an EventStore to push things from', function() {

		var fnCreateRoutes = function() {
			return new Middleware();
		};
		expect(fnCreateRoutes).to.throw();

		var fnCreateRoutesWithOnlyApp = function() {
			var fakeApp = new FakeApp();
			return new Middleware(fakeApp);
		};
		expect(fnCreateRoutesWithOnlyApp).to.throw();

		var fakeApp = new FakeApp();
		var source = Rx.Observable.create(function(observer) {});
		var middleware = new Middleware(fakeApp, source);

		expect(middleware).to.be.ok;

	});
});

describe('Given that we have a middleware, ', function() {

	it('when we add nothing as a route, it throws an exception', function() {

		var testData = new TestData();

		var fakeApp = new FakeApp();
		var source = Rx.Observable.create(function(observer) {});
		var middleware = new Middleware(fakeApp, source);

		var fnAddNullRoute = function() {
			middleware.addRoute();
		};

		expect(fnAddNullRoute).to.throw();
	});
});

describe('Given that we have a middleware, ', function() {

	it('when we add a route using get, it configures this route into the web application', function() {

		var fakeApp = new FakeApp();
		var testData = new TestData();
		var source = Rx.Observable.create(function(observer) {});
		var middleware = new Middleware(fakeApp, source);
		var route = {
			url: "/test/",
			verb: "GET",
			extract: function() {},
			execute: function() {}
		};

		middleware.addRoute(route);

		expect(fakeApp.getRoutes()).to.be.ok;
		expect(fakeApp.getRoutes().length).to.equal(1);

	});
});

describe('Given that we have a middleware, ', function() {

	it('when we add a route using post, it configures this route into the web application', function() {

		var fakeApp = new FakeApp();
		var testData = new TestData();
		var source = Rx.Observable.create(function(observer) {});
		var middleware = new Middleware(fakeApp, source);
		var route = {
			url: "/test/",
			verb: "POST",
			extract: function() {},
			execute: function() {}
		};

		middleware.addRoute(route);

		expect(fakeApp.postRoutes()).to.be.ok;
		expect(fakeApp.postRoutes().length).to.equal(1);

	});
});

describe('Given that we have a middleware, ', function() {

	it('when we add  the routes passing null, it throws an exception', function() {

		var fakeApp = new FakeApp();
		var testData = new TestData();
		var source = Rx.Observable.create(function(observer) {});
		var middleware = new Middleware(fakeApp, source);

		var gameRepo = new ReturnDataGamesRepo(testData.games);
		var commandHandler = new CommandHandler('game', msgDispatcher);
		var gamesRoutes = new GamesRoutes(gameRepo, commandHandler);


		var fnAddingRoutesNull = function() {
			middleware.addRoutes();
		};

		expect(fnAddingRoutesNull).to.throw();

	});
});

describe('Given that we have a middleware, ', function() {

	it('when we add  the games routes, it configures all the games routes into the web application', function() {

		var fakeApp = new FakeApp();
		var testData = new TestData();
		var source = Rx.Observable.create(function(observer) {});
		var middleware = new Middleware(fakeApp, source);

		var gameRepo = new ReturnDataGamesRepo(testData.games);
        var commandHandler = new CommandHandler('game', msgDispatcher);
        var gamesRoutes = new GamesRoutes(gameRepo, commandHandler);

		middleware.addRoutes(gamesRoutes);

		expect(fakeApp.getRoutes()).to.be.ok;
		expect(fakeApp.getRoutes().length).to.equal(2);

		expect(fakeApp.postRoutes()).to.be.ok;
		expect(fakeApp.postRoutes().length).to.equal(3);

	});
});

describe('Given that we have a middleware, ', function() {
	it('when we add  the bears routes, it configures all the bears routes into the web application', function() {

		var fakeApp = new FakeApp();
		var testData = new TestData();
		var source = Rx.Observable.create(function(observer) {});
		var middleware = new Middleware(fakeApp, source);

		var user = {
            id: 7,
            username: 'yoann'
        };

		var bearRepo = new ReturnDataGamesRepo(user);
		var commandHandler = new CommandHandler('bear', msgDispatcher);
        var bearsRoutes = new BearsRoutes(bearRepo, commandHandler);

		middleware.addRoutes(bearsRoutes);

		expect(fakeApp.getRoutes()).to.be.ok;
		expect(fakeApp.getRoutes().length).to.equal(2);
		expect(fakeApp.params().length).to.equal(1);

	});
});

describe('Given that we have a middleware, ', function() {
	it('when we add  a param, we need something', function() {

		var fakeApp = new FakeApp();
		var testData = new TestData();
		var source = Rx.Observable.create(function(observer) {});
		var middleware = new Middleware(fakeApp, source);

        var createParamNull = function(){
			middleware.addParam();	        	
        };

        expect(createParamNull).to.throw();

	});
});

describe('Given that we have a middleware, ', function() {
	it('when we add  a user_id param, it configures the parameter in the web application', function() {

		var fakeApp = new FakeApp();
		var testData = new TestData();
		var source = Rx.Observable.create(function(observer) {});
		var middleware = new Middleware(fakeApp, source);

		var execute = function(){};

		middleware.addParam(ProfileIdParam);	

		expect(fakeApp.params()).to.be.ok;
		expect(fakeApp.params().length).to.equal(1);

	});
});

describe('Given that we have a middleware, ', function() {
	it('when we add  twice user_id param, it configures the parameter in the web application only once', function() {

		var fakeApp = new FakeApp();
		var testData = new TestData();
		var source = Rx.Observable.create(function(observer) {});
		var middleware = new Middleware(fakeApp, source);

		var execute = function(){};

		middleware.addParam(ProfileIdParam);	
		middleware.addParam(ProfileIdParam);	

		expect(fakeApp.params()).to.be.ok;
		expect(fakeApp.params().length).to.equal(1);

	});
});



