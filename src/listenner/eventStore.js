var ges = require('ges-client');
var Rx = require('rx');




//event example
// { Id: '40e31565-fc54-42f0-d704-5bf2d925f654',
//   Version: 0,
//   MetaData:
//    { CorrelationId: '8d66269a-ae76-4439-e8e8-2406274865cb',
//      UserId: '079752e0-97ce-4e81-b15b-4198feba8419',
//      UserName: 'bond' },
//   PayLoad:
//    { Case: 'CreateGame',
//      Fields: [ 'test', '007', '2014-10-16 18:00', 'Playsoccer', '4' ] } }
// { host: 'localhost',
//   port: '8081',
//   path: '/game/40e31565-fc54-42f0-d704-5bf2d925f654',
//   method: 'POST',
//   headers: { 'Content-Type': 'application/json', 'Content-Length': 283 } }



var eventStore = function(){

	var _connection = null; 
	this.connect = function(){
		
		
		_connection= ges();
		
	};

	this.subscribe = function(stream){
		if (!_connection) throw 'not connected';

		var _subject = new Rx.Subject();

		_connection.on('connect', function() {
		  var subscription = _connection.subscribeToStream(stream);

		  subscription.on('event', function(evt) {
		      setTimeout(function(){
				_subject.onNext(evt);
			  },0);

		      	
	      });

		});		

	    var cold = Rx.Observable.create(function(observer){
	    	_subject.subscribe(
		   	function(x) { observer.onNext(x); },
			function(err) { console.log(err); },
			function() { console.log('Completed'); });
	    });

	    var hot = cold.publish();	

	    hot.connect();

	    return hot;
	};
	
};

module.exports = eventStore;