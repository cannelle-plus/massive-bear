/*jshint expr: true*/
var expect = require('chai').expect;
var Sessions = require('../../../src/eventListener/sessions');
var EventStore = require('../../../src/eventListener/eventStore');
var Bear = require('../../../src/model/bear');

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

    	var user = {userId:'007', username:'bond'};

		var session = sessions.retrieveSession(user);

		expect(session).to.not.be.ok;


    });

	
});

describe('Given a session from a user has been saved', function() {
	it('when one retrieve session from this particular user, it returns its session', function() {

    	var eventStore = new EventStore();
    	var sessions = new Sessions(eventStore);

    	var bear = new Bear('007', '123', 'bond', '3');
        bear.userId = 567;
        var user = {userId :'567', username: 'bond'};

    	sessions.save(bear);
		
    	 var session = sessions.retrieveSession(user);

		expect(session).to.be.ok;
		expect(session.bear()).to.be.ok;
		expect(session.bear().bearId).to.equal('007');
		expect(session.addSubscription).to.be.ok;
		expect(session.addSocket).to.be.ok;		

    });
});

describe('Given two sessions have been saved', function() {
	it('when one retrieve session from the first user, it returns its session', function() {

    	var eventStore = new EventStore();
    	var sessions = new Sessions(eventStore);

    	var bear = new Bear('007', '123', 'bond', '3');
        bear.userId = 567;
        var bear2 = new Bear('008', '456', 'yoann', '3');
        bear2.userId = 789;
        
        var user1 = { userId : '567', username :'bond'};

    	sessions.save(bear);
    	sessions.save(bear2);
		
    	 var session = sessions.retrieveSession(user1);

		expect(session).to.be.ok;
		expect(session.addSubscription).to.be.ok;
		expect(session.addSocket).to.be.ok;		
		expect(session.bear()).to.be.ok;
		expect(session.bear().bearId).to.equal('007');

    });
});