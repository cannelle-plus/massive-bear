/*jshint expr: true*/
var expect = require('chai').expect;
var EventStore = require('../../../src/eventListener/eventStore');

describe('eventStore ', function () {
	it('can be instanciated', function () {

        var es = new EventStore();

        expect(es).to.exist ;
	});
    
    it('has a connect function', function () {
        
		var es = new EventStore();        
		expect(es.connect).to.be.ok;
    });

    it('can subscribe to events pushed by the ges', function () {
        
		var es = new EventStore();        
		expect(es.subscribe).to.be.ok;
    });

});

describe('Given that we are not connected ,', function () {
	it('When we subscribe to an event, then it returns an error', function () {
		var es = new EventStore();        
		

		var creatingObservable = function() {
			es.subscribe('proj-GameList');
		};
		expect(creatingObservable).to.throw();
		
	});
});

describe('Given that we are connected ,', function () {
	it('When we subscribe to an event, then it returns an observable', function () {
		var es = new EventStore();        
		es.connect();

		var observable = es.subscribe('proj-GameList');
		expect(observable).to.be.ok;
		expect(observable.subscribe).to.be.ok;
	});
});