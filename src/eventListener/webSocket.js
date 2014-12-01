// Chargement de socket.io
var expressSession = require('express-session');


var webSocket = function(server, sessions){

	if (!sessions) throw 'sessions not defined';

	var io = require('socket.io').listen(server);

	io.on('connection', function (socket) {
	    
	    var _socket = socket;

	    socket.on('login', function(token){
			var session = sessions.retrieveSession({userId : token});

			if (session)
	     		session.addSocket(_socket);

	    });

	});	

};



module.exports = webSocket;
