/*jshint expr: true*/
var expect = require('chai').expect;
var express = require('express');
var Middleware = require('../../../src/routes/middleware');
var CommandHandler = require('../../../src/commandHandler/commandHandler');
var GamesRoutes = require('../../../src/routes/gamesRoutes');
var BearsRoutes = require('../../../src/routes/bearsRoutes');
var Rx = require('rx');
var Q = require('q');
var App = require('../../../src/app');
var currentPort = require('../currentPort');
var ReturnDataGamesRepo = require('../../../src/repositories/returnDataGamesRepo');
var TestData = require('../../testData');

var request = require('supertest');


describe('Given that we have a user authentified, ', function() {
	it('when we get "/api/bear/profile", we receive its user ', function(done) {

		var testData = new TestData();
        var source = Rx.Observable.create(function(observer) {});

		var app = new App(source);

		var bearRepo = new ReturnDataGamesRepo(testData.user.yoann);
		var bearsRoutes = new BearsRoutes(bearRepo);

		app.addHandlers(bearsRoutes);
		app.addUserLoggedin(testData.user.yoann);

		request(app.start(currentPort()))
			.get('/api/bear/profile')
			.expect(200)
			.end(function(err, res) {
				expect(err).to.not.be.ok;
				expect(res.text).to.equal(JSON.stringify({
					bear: testData.user.yoann
				}));
				done();
			});
	});
});



describe('Given that we have a user authentified, ', function() {
	it('when we get "/api/bear/profile/8" (another user), we receive this user ', function(done) {

		var testData = new TestData();
        var source = Rx.Observable.create(function(observer) {});

		var app = new App(source);

		var bearRepo = new ReturnDataGamesRepo(testData.user.julien);
		var bearsRoutes = new BearsRoutes(bearRepo);

		app.addHandlers(bearsRoutes);
		app.addUserLoggedin(testData.user.yoann);

		request(app.start(currentPort()))
			.get('/api/bear/profile/8')
			.expect(200)
			.end(function(err, res) {
				expect(err).to.not.be.ok;
				expect(res.text).to.equal(JSON.stringify({
					bear: testData.user.julien
				}));
				done();
			});
	});
});


describe('Given that we have a user not authentified, ', function() {
	it('when we get "/api/bear/profile", we receive an unauthorized response 401 ', function(done) {


		var testData = new TestData();
        var source = Rx.Observable.create(function(observer) {});

		var app = new App(source);

		var bearRepo = new ReturnDataGamesRepo(testData.user.yoann);
		var bearsRoutes = new BearsRoutes(bearRepo);

		app.addHandlers(bearsRoutes);
		
		request(app.start(currentPort()))
			.get('/api/bear/profile/8')
			.expect(401)
			.end(function(err, res) {
				done();
			});
	});
});

describe('Given that we have a user not authentified, ', function() {
	it('when we get "/api/bear/profile/8", we receive an unauthorized response 401 ', function(done) {


		var testData = new TestData();
        var source = Rx.Observable.create(function(observer) {});

		var app = new App(source);

		var bearRepo = new ReturnDataGamesRepo(testData.user.julien);
		var bearsRoutes = new BearsRoutes(bearRepo);

		app.addHandlers(bearsRoutes);
		

		request(app.start(currentPort()))
			.get('/api/bear/profile/8')
			.expect(401)
			.end(function(err, res) {
				done();
			});
	});
});