var database = require('./databaseObject'); //gives access to database object, ready for queries
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
				var registerStatus = registerUser(msg.registerData);

				var regsiternResponse = {};
				regsiternResponse.command = "login";
				regsiternResponse.requestId = msg.requestId;
				regsiternResponse.result = loginStatus;
				
				client.socket.send(JSON.stringify(regsiterResponse));
			}
	}

	if(serverSettings.clientMessagesLogging === true) 
		console.log("Client " + client.id + " send message. ID: " + msg.command);
}

function logInUser(loginData)
{
	loginData.UserEmail = "test@test.com";
	loginData.UserPassword = "xyzpass";	

//
	var loginQuery = "SELECT UserPasswordHash FROM Users WHERE UserEmail = " + loginData.email;
	database.query(loginQuery,function(err, rows, fields) {
		 if(rows[0].password == loginData.password) return true;
		 else return false; 
	});
}

function registerUser(registerData)
{
	registerData.UserId = "AUX12345"; //numer dowodu osobistego
	registerData.UserFirstName = "Paweł";
	registerData.UserSecondName = "Karol"; //not mandatory
	registerData.UserLastName = "Majewski";
	registerData.UserEmail = "pawel@majewski.pl";
	registerData.UserPasswordHash = "abcd";
	registerData.UserPermissionLevel = "superadmin"; //będzie pakiet dający listę dostępnych user permission leveli
}

function setUserPermissionLevel(data)
{
	data.UserId = "AUX12345";
	data.UserPermissionLevel = "superadmin";
}

var query = "SELECT * FROM `idc hotel suite database`.hotels";
database.query(query, function(err, rows, fields) {
	console.log(rows[0]);
});