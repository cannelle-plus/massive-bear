var ges = require('ges-client');

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

var gesClient = function(){

	var connection = ges(), stream = 'proj-GameList';

	connection.on('connect', function() {
	  var subscription = connection.subscribeToStream(stream);

	    // 3) Listen for events
	  subscription.on('event', function(evt) {
	      // ta da!
	      console.log(evt);
	  });

	});
	
	
};

module.exports = gesClient;