/*jshint expr: true*/
var expect = require('chai').expect;
var express = require('express');
var authStaticUser = require('../../helper/authStaticUser.helper');
var currentPort = require('../../helper/currentPort.helper');
var WebSocket = require('../../helper/webSocket.helper');

var Rx = require('rx');
var Q = require('q');

var HomeRoutes = require('../../../src/routes/homeRoutes');
var TestData = require('../../helper/testData.helper');
var App = require('../../../src/app');
var request = require('supertest');

describe('Given that we have a bear not authentified, ', function() {
    it('when we get "/", we receive the home.html file', function(done) {
        
        var source = Rx.Observable.create(function(observer) {});

        var app = new App(source, authStaticUser(), WebSocket);

        var homeRoutes = new HomeRoutes();

        app.addHandlers(homeRoutes);

        request(app.start(currentPort()))
            .get('/')
            .expect(200)
            .end(function(err, res) {
                expect(err).to.not.be.ok;
                expect(res.header['content-type']).to.equal('text/html; charset=UTF-8');
                expect(res.text.indexOf('<title>home</title>')>-1).to.equal(true);
                
                done();
            });
    });
});

describe('Given that we have a bear authentified, ', function() {
    it('when we get "/", we receive a redirection to "/games"', function(done) {
        
        var source = Rx.Observable.create(function(observer) {});
        var testData = new TestData();

        var app = new App(source, authStaticUser(testData.bear.yoann), WebSocket);

        var homeRoutes = new HomeRoutes();

        app.addHandlers(homeRoutes);

        request(app.start(currentPort()))
            .get('/')
            .expect(302)
            .end(function(err, res) {
                expect(err).to.not.be.ok;
                expect(res.header.location).to.equal('/games');
                done();
            });
    });
});
