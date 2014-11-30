// Chargement de socket.io


var webSocket = function(server, sessions){

	if (!sessions) throw 'sessions not defined';

	var io = require('socket.io')(server);
	io.on('connection', function (socket) {
	    
	    var _socket = socket;

	    socket.on('login', function(user){
			// var session = sessions.retrieveSession(user);

	  //   	session.addSocket(_socket);

	    });

	});	

};



module.exports = webSocket;
