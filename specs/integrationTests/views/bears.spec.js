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

 var Rx = require('rx');
 var Q = require('q');

 var Middleware = require('../../../src/routes/middleware');
 var CommandHandler = require('../../../src/commandHandler/commandHandler');
 var BearsRoutes = require('../../../src/routes/bearsRoutes');
 var App = require('../../../src/app');
 var request = require('supertest');


 describe('Integration Tests : bear views, ', function() {
     describe('Given that we have a bear authentified, ', function() {
         it('when we get "/signin", we receive the signin.html file', function(done) {

             var testData = new TestData();
             var source = Rx.Observable.create(function(observer) {});

             var app = new App(source, authStaticUser(testData.bear.yoann), WebSocket);

             var bearRepo = new ReturnDataGamesRepo(testData.bear.julien);
             var commandHandler = new CommandHandler(oKDispatcher('bear'));
             var bearsRoutes = new BearsRoutes(bearRepo, commandHandler);

             app.addHandlers(bearsRoutes);

             request(app.start(currentPort()))
                 .get('/signin')
                 .expect(200)
                 .end(function(err, res) {
                     expect(err).to.not.be.ok;
                     expect(res.header['content-type']).to.equal('text/html; charset=UTF-8');
                     expect(res.text.indexOf('<title>signin</title>') > -1).to.equal(true);

                     done();
                 });
         });
     });

     describe('Given that we have a bear not authentified, ', function() {
         it('when we get "/signin", we receive a redirection to "/"', function(done) {

             var testData = new TestData();
             var source = Rx.Observable.create(function(observer) {});

             var app = new App(source, authStaticUser(), WebSocket);

             var bearRepo = new ReturnDataGamesRepo(testData.bear.julien);
             var commandHandler = new CommandHandler(oKDispatcher('bear'));
             var bearsRoutes = new BearsRoutes(bearRepo, commandHandler);

             app.addHandlers(bearsRoutes);

             request(app.start(currentPort()))
                 .get('/signin')
                 .expect(302)
                 .end(function(err, res) {
                     expect(err).to.not.be.ok;
                     expect(res.header.location).to.equal('/');
                     done();
                 });
         });
     });

         

        
 });