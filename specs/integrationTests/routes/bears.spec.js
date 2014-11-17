 /*jshint expr: true*/
var expect = require('chai').expect;
var express = require('express');
var Middleware = require('../../../src/routes/middleware');
var CommandHandler = require('../../../src/commandHandler/commandHandler');
var msgDispatcher =require('../../../src/commandHandler/msgDispatcher');
var BearsRoutes = require('../../../src/routes/bearsRoutes');
var Rx = require('rx');
var Q = require('q');
var App = require('../../../src/app');
var authStaticUser = require('../../../src/auth/authStaticUser');
var currentPort = require('../currentPort');
var ReturnDataGamesRepo = require('../../../src/repositories/returnDataGamesRepo');
var TestData = require('../../testData');
var oKDispatcher = require('../../../src/commandHandler/oKDispatcher');

var request = require('supertest');


describe('Given that we have a bear authentified, ', function() {
	it('when we get "/api/bear/profile", we receive its bear ', function(done) {

		var testData = new TestData();
        var source = Rx.Observable.create(function(observer) {});

		var app = new App(source, authStaticUser(testData.bear.yoann));

		var bearRepo = new ReturnDataGamesRepo(testData.bear.yoann);
		var commandHandler = new CommandHandler('bear', msgDispatcher);
		var bearsRoutes = new BearsRoutes(bearRepo, commandHandler);

		app.addHandlers(bearsRoutes);

		request(app.start(currentPort()))
			.get('/api/bear/profile')
			.expect(200)
			.end(function(err, res) {
				expect(err).to.not.be.ok;
				expect(res.text).to.equal(JSON.stringify({
					bear: testData.bear.yoann
				}));
				done();
			});
	});
});



describe('Given that we have a bear authentified, ', function() {
	it('when we get "/api/bear/profile/8" (another bear), we receive this bear ', function(done) {

		var testData = new TestData();
        var source = Rx.Observable.create(function(observer) {});

		var app = new App(source, authStaticUser(testData.bear.yoann));

		var bearRepo = new ReturnDataGamesRepo(testData.bear.julien);
		var commandHandler = new CommandHandler('bear', msgDispatcher);
		var bearsRoutes = new BearsRoutes(bearRepo, commandHandler);

		app.addHandlers(bearsRoutes);

		request(app.start(currentPort()))
			.get('/api/bear/profile/8')
			.expect(200)
			.end(function(err, res) {
				expect(err).to.not.be.ok;
				expect(res.text).to.equal(JSON.stringify({
					bear: testData.bear.julien
				}));
				done();
			});
	});
});


describe('Given that we have a bear not authentified, ', function() {
	it('when we get "/api/bear/profile", we receive an unauthorized response 401 ', function(done) {


		var testData = new TestData();
        var source = Rx.Observable.create(function(observer) {});

		var app = new App(source, authStaticUser());

		var bearRepo = new ReturnDataGamesRepo(testData.bear.yoann);
		var commandHandler = new CommandHandler('bear', msgDispatcher);
		var bearsRoutes = new BearsRoutes(bearRepo, commandHandler);

		app.addHandlers(bearsRoutes);
		
		request(app.start(currentPort()))
			.get('/api/bear/profile/8')
			.expect(401)
			.end(function(err, res) {
				done();
			});
	});
});

describe('Given that we have a bear not authentified, ', function() {
	it('when we get "/api/bear/profile/8", we receive an unauthorized response 401 ', function(done) {


		var testData = new TestData();
        var source = Rx.Observable.create(function(observer) {});

		var app = new App(source, authStaticUser());

		var bearRepo = new ReturnDataGamesRepo(testData.bear.julien);
		var commandHandler = new CommandHandler('bear', msgDispatcher);
		var bearsRoutes = new BearsRoutes(bearRepo, commandHandler);

		app.addHandlers(bearsRoutes);
		

		request(app.start(currentPort()))
			.get('/api/bear/profile/8')
			.expect(401)
			.end(function(err, res) {
				done();
			});
	});
});

describe('Given that we have a bear authentified, ', function() {
	it('when we post "/api/bear/signin" , we dispatch a command', function(done) {

		var testData = new TestData();
        var source = Rx.Observable.create(function(observer) {});

		var app = new App(source, authStaticUser(testData.bear.yoann));

		var bearRepo = new ReturnDataGamesRepo(testData.bear.julien);
		var commandHandler = new CommandHandler('bear', oKDispatcher);
		var bearsRoutes = new BearsRoutes(bearRepo, commandHandler);

		app.addHandlers(bearsRoutes);

		request(app.start(currentPort()))
			.post('/api/bear/profile')
			.send(testData.yoloEvents.signedIn)
			.expect(200)
			.end(function(err, res) {
				expect(err).to.not.be.ok;
                expect(res.text).to.equal(JSON.stringify(testData.responseFromTheDispatcher));
                done();
			});
	});
});