var net = require('net');

var sockets = [];
 
/*
 * Cleans the input of carriage return, newline
 */
function cleanInput(data) {
	return data.toString().replace(/(\r\n|\n|\r)/gm,"");
}
 
/*
 * Method executed when data is received from a socket
 */
function receiveData(socket, data) {
	var cleanData = cleanInput(data);
	if(cleanData === "@quit") {
		socket.end('Goodbye!\n');
	}
	else {
		for(var i = 0; i<sockets.length; i++) {
			if (sockets[i] !== socket) {
				sockets[i].write(data);
			}
		}
	}
}
 
/*
 * Method executed when a socket ends
 */
function closeSocket(socket) {
	var i = sockets.indexOf(socket);
	if (i != -1) {
		sockets.splice(i, 1);
	}
}
 
/*
 * Callback method executed when a new TCP socket is opened.
 */
function connection_listener(socket) {
	sockets.push(socket);
	socket.write('Welcome to the Telnet server!\n');
	socket.on('data', function(data) {
		receiveData(socket, data);
	})
	socket.on('end', function() {
		closeSocket(socket);
	})
}