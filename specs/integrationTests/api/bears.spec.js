 /*jshint expr: true*/
 var expect = require('chai').expect;
 var express = require('express');
 var ReturnDataGamesRepo = require('../../helper/returnDataGamesRepo.helper');
 var oKDispatcher = require('../../helper/oKDispatcher.helper');
 var authStaticUser = require('../../helper/authStaticUser.helper');
 var bearMsgDispatcher = oKDispatcher('bear');
 var TestData = require('../../helper/testData.helper');
 var currentPort = require('../../helper/currentPort.helper');
 var WebSocket = require('../../helper/webSocket.helper');
 var bearDispatcher = oKDispatcher('bear');

 var Rx = require('rx');
 var Q = require('q');

 var Middleware = require('../../../src/routes/middleware');
 var CommandHandler = require('../../../src/commandHandler/commandHandler');
 var BearsRoutes = require('../../../src/routes/bearsRoutes');
 var App = require('../../../src/app');
 var request = require('supertest');

 describe('Integration Tests : bear api, ', function() {
 	describe('Given that we have a bear authentified and signed in, ', function() {
 		it('when we get "/api/bear/profile", we receive its bear ', function(done) {

 			var testData = new TestData();
 			var source = Rx.Observable.create(function(observer) {});

 			var app = new App(source, authStaticUser(testData.bear.yoann), WebSocket);

 			var bearRepo = new ReturnDataGamesRepo(testData.bear.yoann);
 			var commandHandler = new CommandHandler(bearMsgDispatcher);
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

    describe('Given that we have a bear authentified but not signedIn, ', function() {
        it('when we get "/api/bear/profile", we receive its bear ', function(done) {

            var testData = new TestData();
            var source = Rx.Observable.create(function(observer) {});

            var app = new App(source, authStaticUser(testData.bear.yoann), WebSocket);

            var bearRepo = new ReturnDataGamesRepo();
            var commandHandler = new CommandHandler(bearMsgDispatcher);
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

 			var app = new App(source, authStaticUser(testData.bear.yoann), WebSocket);

 			var bearRepo = new ReturnDataGamesRepo(testData.bear.julien);
 			var commandHandler = new CommandHandler(bearMsgDispatcher);
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
 		it('when we get "/api/bear/profile/8", we receive an unauthorized response 401 ', function(done) {


 			var testData = new TestData();
 			var source = Rx.Observable.create(function(observer) {});

 			var app = new App(source, authStaticUser(), WebSocket);

 			var bearRepo = new ReturnDataGamesRepo(testData.bear.yoann);
 			var commandHandler = new CommandHandler(bearMsgDispatcher);
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

 			var app = new App(source, authStaticUser(), WebSocket);

 			var bearRepo = new ReturnDataGamesRepo(testData.bear.julien);
 			var commandHandler = new CommandHandler(bearMsgDispatcher);
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

            var app = new App(source, authStaticUser(testData.bear.yoann), WebSocket);

            var bearRepo = new ReturnDataGamesRepo(testData.bear.julien);
            var commandHandler = new CommandHandler(bearDispatcher);
            var bearsRoutes = new BearsRoutes(bearRepo, commandHandler);

            app.addHandlers(bearsRoutes);

            request(app.start(currentPort()))
                .post('/api/bear/signin')
                .send(testData.yoloEvents.hasSignedIn)
                .expect(200)
                .end(function(err, res) {
                    expect(err).to.not.be.ok;
                    expect(res.text).to.equal(JSON.stringify(testData.responseFromTheDispatcher));
                    done();
                });
        });
    });	

    describe('Given that we have a bear not authentified, ', function() {
        it('when we post "/api/bear/signin" , we receive an unauthorized response 401 ', function(done) {

            var testData = new TestData();
            var source = Rx.Observable.create(function(observer) {});

            var app = new App(source, authStaticUser(), WebSocket);

            var bearRepo = new ReturnDataGamesRepo(testData.bear.julien);
            var commandHandler = new CommandHandler(oKDispatcher('bear'));
            var bearsRoutes = new BearsRoutes(bearRepo, commandHandler);

            app.addHandlers(bearsRoutes);

            request(app.start(currentPort()))
                .post('/api/bear/signin')
                .send(testData.yoloEvents.hasSignedIn)
                .expect(401)
                .end(function(err, res) {
                    done();
                });
        });
    });

 	
 });