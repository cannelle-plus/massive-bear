/*jshint expr: true*/
var expect = require('chai').expect;
var Sessions = require('../../../src/eventListener/sessions');
var EventStore = require('../../../src/eventListener/eventStore');

describe('Sessions', function() {

	it('are created with an eventstore', function() {

		var eventStore = new EventStore();
    	var sessions = new Sessions(eventStore);

    	expect(sessions).to.be.ok;

    });

});

describe('Given no session has been saved', function() {
	it('when one retrieve session from user, it returns null', function() {

    	var eventStore = new EventStore();
    	var sessions = new Sessions(eventStore);

    	var user = {id:'007', username:'bond'};

		var session = sessions.retrieveSession(user);

		expect(session).to.not.be.ok;


    });

	
});

describe('Given a session from a user has been saved', function() {
	it('when one retrieve session from this particular user, it returns its session', function() {

    	var eventStore = new EventStore();
    	var sessions = new Sessions(eventStore);

    	var user = {id:'007', username:'bond'};

    	sessions.save(user);
		
    	 var session = sessions.retrieveSession(user);

		expect(session).to.be.ok;
		expect(session.user()).to.be.ok;
		expect(session.user().id).to.equal('007');
		expect(session.addSubscription).to.be.ok;
		expect(session.addSocket).to.be.ok;		

    });
});

describe('Given two sessions have been saved', function() {
	it('when one retrieve session from the first user, it returns its session', function() {

    	var eventStore = new EventStore();
    	var sessions = new Sessions(eventStore);

    	var user1 = {id:'007', username:'bond'};
    	var user2 = {id:'008', username:'yoann'};

    	sessions.save(user1);
    	sessions.save(user2);
		
    	 var session = sessions.retrieveSession(user1);

		expect(session).to.be.ok;
		expect(session.addSubscription).to.be.ok;
		expect(session.addSocket).to.be.ok;		
		expect(session.user()).to.be.ok;
		expect(session.user().id).to.equal('007');

    });
});