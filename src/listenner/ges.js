var ges = require('ges-client');

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