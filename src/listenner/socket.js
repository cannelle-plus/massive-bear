// Chargement de socket.io


var socket = function(server){

	var io = require('socket.io')(server);

	// Quand on client se connecte, on le note dans la console
	io.on('connection', function (socket) {
	    socket.emit('news', { hello: 'world' });
		socket.on('my other event', function (data) {
		  console.log(data);
		});
	});	
};



module.exports = socket;
