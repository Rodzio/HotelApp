require('./databaseObject'); //gives access to database object, ready for queries
require('./serverSettings'); //gives access to server settings like logging particular things

function Client(ws)
{
	var client = {};
	client.id = getRandomInt(1,5000);
	client.info = null; //filled when user successfully logs in
	client.confirmed = false; //set to yes if user sends 
	client.socket = ws;
	client.socket.on('message', function(msg)
		{
			messageHandler(msg, client);
		});

	client.socket.on('close', function(msg)
		{
			if(serverSettings.connectionLogging === true)
				console.log("Client " + client.id + " disconnected.");
		});

	if(serverSettings.connectionLogging === true)
		console.log("Client " + client.id + " connected.");

	return client;
}
var clients = [];

var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: serverSettings.listenPort});

wss.on('connection', function(ws) {
	clients.push(Client(ws));
});

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function messageHandler(msgString, client)
{
	msg = JSON.parse(msgString);

	if(serverSettings.mode == "echo") 
		client.socket.send(msgString);

	else if(serverSettings.mode == "default")
	{
		if(client.confirmed === false)
			if(msg.command == "hello")
			{
				client.confirmed = true;

				var helloResponse = {};
				helloReponse.command = "hello";
				helloResponse.requestId = msg.requestId;

				client.socket.send(JSON.stringify(helloResponse));
			}
			//ignore other cases, as communication hasn't been fully established
		else if(client.confirmed === true)
			if(msg.command == "login")
			{
				var loginStatus = logInUser(msg.loginData);
				
				var loginResponse = {};
				loginResponse.command = "login";
				loginResponse.requestId = msg.requestId;
				loginResponse.result = loginStatus;
				
				client.socket.send(JSON.stringify(loginResponse));
			}
			if(msg.command == "register")
			{
				var registerStatus = registerUser(msg.registerData)
			}
	}

	if(serverSettings.clientMessagesLogging === true) 
		console.log("Client " + client.id + " send message. ID: " + msg.command);
}

function logInUser(loginData)
{
	loginData.email = "test@test.com";
	loginData.password = "xyzpass";	

//
	var loginQuery = "SELECT password FROM users WHERE email == " + loginData.email;
	database.query(loginQuery,function(err, rows, fields) {
		 if(rows[0].password == loginData.password) return true;
		 else return false; 
	});
}

function registerUser(registerData)
{

}

