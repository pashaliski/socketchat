var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

users = [];
connections = [];

server.listen(process.env.PORT || 3000);
console.log('Server running ...');

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket){
	connections.push(socket);
	console.log('Changes in Socket connections, we have %s connections', connections.length);

	//Socket Disconnect
	socket.on('disconnect', function(data){
		users.splice(users.indexOf(socket.username), 1);
		console.log(users);
		io.sockets.emit('new test', users);
		/*updateUsernames();*/
		connections.splice(connections.indexOf(socket), 1);
		console.log('Socket Disconected: %s active connections', connections.length);
	});

	//Send Message
	socket.on('send message', function(data){
		io.sockets.emit('new message', {msg:data, user:socket.username});
	});

	//New user
	socket.on('new user', function(data, callback){
		callback(true);
		socket.username = data;
		users.push(socket.username);
		console.log(users);
		io.sockets.emit('new test', users);
		/*updateUsernames();*/
	});

	function updateUsernames(){
		io.socket.emit('get users', users);
	}
});
