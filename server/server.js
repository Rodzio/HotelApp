var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: 8080});

wss.on('connection', function(ws) {
	clients.push(Client(ws));
});

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function Client(ws)
{
	var client = {};
	client.id = getRandomInt(1,5000);
	client.socket = ws;
	client.socket.on('message', function(data)
		{
			messageHandler(data, client);
		});
	return client;
}
var clients = [];

function messageHandler(data, client)
{
	//console.log('received: %s', j.requestId);
	console.log(client.id);
	client.socket.send(data);
}