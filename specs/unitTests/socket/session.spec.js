/*jshint expr: true*/
var expect = require('chai').expect;
var Session = require('../../../src/eventListener/session');
var EventSender = require('../../eventSender');
var Rx = require('rx');

describe('A session', function() {

    it('needs a user and a eventSource', function() {

        var source = Rx.Observable.create(function (observer) {
            observer.onNext(42);
            observer.onNext(43);
            observer.onNext(44);
            observer.onNext(45);
        });

        var fnCreateSession = function(){
            return new Session();
        };

        expect(fnCreateSession).to.throw();

        var fnCreateSessionWithUserOnly = function(){
            return new Session({id:'007', username:'bond'});
        };

        expect(fnCreateSessionWithUserOnly).to.throw();

        var fnCreateSessionWithSourceOnly = function(){
            return new Session(undefined,source);
        };

        expect(fnCreateSessionWithSourceOnly).to.throw();

        var session = new Session({id:'007', username:'bond'}, source);

        expect(session).to.be.ok;

    });

    it('can add a subscription', function() {

    	var source = Rx.Observable.create(function (observer) {
            observer.onNext(42);
            observer.onNext(43);
            observer.onNext(44);
            observer.onNext(45);
        });

        var socket = { 
            emit : function() {
        	   done();
            }
        };

    	var session = new Session({id:'007', username:'bond'}, source);

    	session.addSubscription(function(x){
    		return x== 44;
    	});

        expect(session).to.be.ok;

    });

    it('can add two subscriptions', function() {

        var source = Rx.Observable.create(function (observer) {
            observer.onNext(42);
            observer.onNext(43);
            observer.onNext(44);
            observer.onNext(45);
        });

        var socket = { 
            emit : function() {
               done();
            }
        };

        var session = new Session({id:'007', username:'bond'}, source);

        session.addSubscription(function(x){
            return x== 44;
        });

        session.addSubscription(function(x){
            return x== 45;
        });

        expect(session).to.be.ok;

    });

    it('can add a socket eventListener to a single subscription', function(done) {

        var source = Rx.Observable.create(function (observer) {
            observer.onNext(42);
            observer.onNext(43);
            observer.onNext(44);
            observer.onNext(45);
        });

        var socket = { 
            emit : function() {
               done();
            }
        };

        var session = new Session({id:'007', username:'bond'}, source);

        session.addSubscription(function(x){
            return x== 44;
        });

        session.addSocket(socket);

    });

    it('can add a socket eventListener to two subscriptions', function(done) {

        var source = Rx.Observable.create(function (observer) {
            observer.onNext(42);
            observer.onNext(43);
            observer.onNext(44);
            observer.onNext(45);
        });

        var counter=0;

        var socket = { 
            emit : function() {
                counter += 1;
                if (counter==2) done();
            }
        };

        var session = new Session({id:'007', username:'bond'}, source);

        session.addSubscription(function(x){
            return x== 44;
        });

        session.addSubscription(function(x){
            return x== 45;
        });

        session.addSocket(socket);

    });


    it('can add two sockets eventListener to a single subscription', function(done) {

        var source = Rx.Observable.create(function (observer) {
            observer.onNext(42);
            observer.onNext(43);
            observer.onNext(44);
            observer.onNext(45);
        });

        var counter=0;

        var socket = { 
            emit : function() {
                counter += 1;
                if (counter==2) done();
            }
        };

        var socket2 = { 
            emit : function() {
                counter += 1;
                if (counter==2) done();
            }
        };

        var session = new Session({id:'007', username:'bond'}, source);

        session.addSubscription(function(x){
            return x== 44;
        });

        session.addSocket(socket);
        session.addSocket(socket2);

    });

    it('can add two sockets eventListener to two subscriptions', function(done) {

        var source = Rx.Observable.create(function (observer) {
            observer.onNext(42);
            observer.onNext(43);
            observer.onNext(44);
            observer.onNext(45);
        });

        var counter=0;

        var socket = { 
            emit : function() {
                counter += 1;
                if (counter==4) done();
            }
        };

        var socket2 = { 
            emit : function() {
                counter += 1;
                if (counter==4) done();
            }
        };

        var session = new Session({id:'007', username:'bond'}, source);

        session.addSubscription(function(x){
            return x== 44;
        });

        session.addSubscription(function(x){
            return x== 45;
        });

        session.addSocket(socket);
        session.addSocket(socket2);

    });


});


describe('Givent that a session has subscribed to an eventSource', function() {

    it('When a new event arrives, it triggers the subscription', function(done) {

        var source = Rx.Observable.create(function (observer) {
            observer.onNext(42);
            observer.onNext(43);
            observer.onNext(44);
            observer.onNext(45);
            setTimeout(function() { observer.onNext(46); }, 150);
        });

        var socket = { 
            emit : function() {
                 done();
            }
        };

        var session = new Session({id:'007', username:'bond'}, source);

        session.addSubscription(function(x){
            return x == 46;
        });

        session.addSocket(socket);

    });
});

describe('Givent that a session has a socket', function() {

    it('When the session adds a subscription, a new event will trigger the socket', function(done) {

        var eventSender = new EventSender();

        var source = eventSender.source();

        var socket = { 
            emit : function() {
                 done();
            }
        };

        var session = new Session({id:'007', username:'bond'}, source);

        session.addSocket(socket);

        session.addSubscription(function(x){
            return x == 46;
        });

        eventSender.sendEvent(46);

    });
});