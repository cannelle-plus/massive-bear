/*jshint expr: true*/
var expect = require('chai').expect;
var express = require('express');
var Middleware = require('../../../src/routes/middleware');
var CommandHandler = require('../../../src/dispatcher/commandHandler');
var GamesRoutes = require('../../../src/routes/gamesRoutes');
var BearsRoutes = require('../../../src/routes/bearsRoutes');
var Rx = require('rx');
var Q = require('q');

var request = require('supertest');

var FakeBearRepo = function(data) {
	this.getBear = function() {
		var deferred = Q.defer();
		setTimeout(function() {
			deferred.resolve(data);
		}, 1);
		return deferred.promise;
	};
};

var port = 8280;

var currentPort = function()
{
	port = port +1;
	return port;
};

describe('Given that we have a user authentified, ', function() {
	it('when we get "/api/bear/profile", we receive its user ', function(done) {


		var router = express.Router();
		var app = express();


		var source = Rx.Observable.create(function(observer) {});

		var middleware = new Middleware(router, source);

		var user = {
			id: 7,
			username: 'yoann'
		};

		middleware.login(user);

		var bearRepo = new FakeBearRepo(user);
		var bearsRoutes = new BearsRoutes(bearRepo);

		middleware.addRoutes(bearsRoutes);

		// apply the routes to our application
		app.use('/', router);

		app.listen(currentPort());

		request(app)
			.get('/api/bear/profile')
			.expect(200)
			.end(function(err, res) {
				expect(err).to.not.be.ok;
				expect(res.text).to.equal(JSON.stringify({
					bear: user
				}));
				done();
			});
	});
});



describe('Given that we have a user authentified, ', function() {
	it('when we get "/api/bear/profile/8" (another user), we receive this user ', function(done) {


		var router = express.Router();
		var app = express();
		var port = process.env.PORT || 8080;

		var source = Rx.Observable.create(function(observer) {});

		var middleware = new Middleware(router, source);

		var user = {
			id: 7,
			username: 'yoann'
		};

		middleware.login(user);

		var bearRepo = new FakeBearRepo(user);
		var bearsRoutes = new BearsRoutes(bearRepo);

		middleware.addRoutes(bearsRoutes);

		// apply the routes to our application
		app.use('/', router);

		app.listen(currentPort());

		request(app)
			.get('/api/bear/profile/8')
			.expect(200)
			.end(function(err, res) {
				expect(err).to.not.be.ok;
				expect(res.text).to.equal(JSON.stringify({
					bear: user
				}));
				done();
			});
	});
});


describe('Given that we have a user not authentified, ', function() {
	it('when we get "/api/bear/profile", we receive an unauthorized response 401 ', function(done) {


		var router = express.Router();
		var app = express();
		var port = process.env.PORT || 8080;

		var source = Rx.Observable.create(function(observer) {});

		var middleware = new Middleware(router, source);

		var user = {
			id: 7,
			username: 'yoann'
		};


		var bearRepo = new FakeBearRepo(user);
		var bearsRoutes = new BearsRoutes(bearRepo);

		middleware.addRoutes(bearsRoutes);

		// apply the routes to our application
		app.use('/', router);

		app.listen(currentPort());

		request(app)
			.get('/api/bear/profile/8')
			.expect(401)
			.end(function(err, res) {
				done();
			});
	});
});

describe('Given that we have a user not authentified, ', function() {
	it('when we get "/api/bear/profile/7", we receive an unauthorized response 401 ', function(done) {


		var router = express.Router();
		var app = express();
		var port = process.env.PORT || 8080;

		var source = Rx.Observable.create(function(observer) {});

		var middleware = new Middleware(router, source);

		var user = {
			id: 7,
			username: 'yoann'
		};


		var bearRepo = new FakeBearRepo(user);
		var bearsRoutes = new BearsRoutes(bearRepo);

		middleware.addRoutes(bearsRoutes);

		// apply the routes to our application
		app.use('/', router);

		app.listen(currentPort());

		request(app)
			.get('/api/bear/profile/8')
			.expect(401)
			.end(function(err, res) {
				done();
			});
	});
});