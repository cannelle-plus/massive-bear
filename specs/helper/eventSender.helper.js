var Rx = require('rx');
var uuid = require('node-uuid');
var TestData = require('./testData.helper');

//event example
var wookieEvt = function(options) {
	return {
		Id: options.id,
		Version: 3,
		MetaData: {
			CorrelationId: uuid.v1(),
			UserId: options.userId,
			UserName: options.userName
		},
		PayLoad: {
			Case: options.evtType,
			Fields: options.fields
		}
	};
	//  {
	// 	host: 'localhost',
	// 	port: '8081',
	// 	path: '/was ever',
	// 	method: 'POST',
	// 	headers: {
	// 		'Content-Type': 'application/json',
	// 		'Content-Length': 283
	// 	}
	// }
};

var EventSender = function() {

	var testData = new TestData();

	var _subject = new Rx.Subject();

	this.sendEvent = function(evt) {
		_subject.onNext(evt);

	};

	this.sendGameJoinedEvent = function(id) {
		// _subject.onNext(wookieEvt('40e31565-fc54-42f0-d704-5bf2d925f654',7, 'yoann', 'CreateGame',['test', '007', '2014-10-16 18:00', 'Playsoccer', '4']))
		_subject.onNext(wookieEvt({
			"id" : id,
			userId : testData.bear.tom.id,
			userName : testData.bear.tom.userName,
			evtType :'GameJoined', 
			fields : []
		}));
	};

	this.sendGameAbandonnedEvent = function(id){
		_subject.onNext(wookieEvt({
			"id" : id,
			userId : testData.bear.tom.id,
			userName : testData.bear.tom.userName,
			evtType :'GameAbandonned', 
			fields : []
		}));	
	};

	this.sendGameScheduledEvent = function(id){
		_subject.onNext(wookieEvt({
			"id" : id,
			userId : testData.bear.tom.id,
			userName : testData.bear.tom.userName,
			evtType :'GameScheduled', 
			fields : ['test', '007', '2014-10-16 18:00', 'Playsoccer', '4']
		}));	
	};

	

	this.source = function() {
		return _subject;
	};
};

module.exports = EventSender;
