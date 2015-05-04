var database = require('./databaseObject'); //gives access to database object, ready for queries
require('./serverSettings'); //gives access to server settings like logging particular things

function Client(ws)
{
	var client = {};
	client.id = clients.length;
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
	try
	{
		msg = JSON.parse(msgString);
		if(msg.command == null) throw "Command is null";
		if(serverSettings.clientMessagesLogging === true) 
			console.log("Client " + client.id + " sent message. ID: " + msg.command);
	} 
	catch(e) 
	{
		if(e == "Command is null") console.log("Client " + client.id + " send message, but there is no command field.");
		else console.log("Client " + client.id + " sent message, but it isn't proper JSON object.");
		return false;
	}

	if(serverSettings.mode == "echo") 
		client.socket.send(msgString);

	else if(serverSettings.mode == "default")
	{
		if(client.confirmed === false)
			if(msg.command == "hello")
			{
				client.confirmed = true;

				var helloResponse = {};
				helloResponse.command = "hello";
				helloResponse.requestId = msg.requestId;

				client.socket.send(JSON.stringify(helloResponse));
			}
			//ignore other cases, as communication hasn't been fully established
		//else if(client.confirmed === true)
			if(msg.command == "login")
			{
				database.getConnection(function(err,connection)
				{
					if(err) 
					{
						connection.release();
						return false;
					}

					var loginQuery = "SELECT * FROM `idc hotel suite database`.Users WHERE Users.UserEmail = '" + msg.loginData.userEmail + "'";
					
					connection.query(loginQuery,function(err, rows, fields) {
						connection.release();	
						var loginStatus = false;
						if(rows.length > 0)
						{
							if(rows[0].UserPasswordHash == msg.loginData.userPasswordHash) 
							{
								loginStatus = true;
								client.info = rows[0];
								console.log("Client " + client.id + " successfully authorized as " + client.info.UserFirstName + " " + client.info.UserLastName + ". New client id: " + rows[0].UserId);
								client.id = rows[0].UserId;
							}
						}
						var loginResponse = {};
						loginResponse.command = "login";
						loginResponse.requestId = msg.requestId;
						loginResponse.result = loginStatus;
							
						client.socket.send(JSON.stringify(loginResponse));	
					});
				});
			}

			if(msg.command == "register")
			{
				database.getConnection(function(err,connection)
				{
					if(err) 
					{
						connection.release();
						return false;
					}
	
					var registerQuery = "INSERT INTO `idc hotel suite database`.`users` VALUES ('" + msg.registerData.userId + "','" + msg.registerData.userPermissionLevel + "','" + msg.registerData.userFirstName + "','" + msg.registerData.userSecondName + "','" + msg.registerData.userLastName + "','" + msg.registerData.userEmail + "','" + msg.registerData.userPasswordHash + "');";
					console.log(registerQuery);
					
					connection.query(registerQuery,function(err, rows, fields) {
						connection.release();
						var registerStatus = false;
						
						if(err) console.log(err);
						else registerStatus = true;

						var registerResponse = {};
							registerResponse.command = "register";
							registerResponse.requestId = msg.requestId;
							registerResponse.result = registerStatus;
							registerResponse.message = "";
							
						client.socket.send(JSON.stringify(registerResponse));	
					});
				});
				/*
	registerData.UserId = "AUX12345"; //numer dowodu osobistego
	registerData.UserFirstName = "Paweł";
	registerData.UserSecondName = "Karol"; //not mandatory
	registerData.UserLastName = "Majewski";
	registerData.UserEmail = "pawel@majewski.pl";
	registerData.UserPasswordHash = "abcd";
	registerData.UserPermissionLevel = "superadmin"; //będzie pakiet dający listę dostępnych user permission leveli
				*/
				
			}

			if(msg.command == "user")
			{
				database.getConnection(function(err,connection)
				{
					if(err) 
					{
						connection.release();
						return false;
					}

					var userResponse = {};
					userResponse.command = "user";
					userResponse.requestId = msg.requestId;

					if(msg.action === "list")
					{
						var userQuery = "SELECT * FROM `idc hotel suite database`.Users;";
					}
					else if(msg.action === "update")
					{
						var userQuery = "SELECT * FROM `idc hotel suite database`.Users WHERE Users.UserEmail = '" + msg.loginData.userEmail + "'";
						userResponse.result = false;
						userResponse.message = "not_implemented";

						client.socket.send(JSON.stringify(userResponse));
						return false;
					}
					else if(msg.action === "delete")
					{
						var userQuery = "SELECT * FROM `idc hotel suite database`.Users WHERE Users.UserEmail = '" + msg.loginData.userEmail + "'";
						userResponse.result = false;
						userResponse.message = "not_implemented";

						client.socket.send(JSON.stringify(userResponse));
						return false;
					}
					else
					{
						userResponse.result = false;
						userResponse.message = "invalid_action";

						client.socket.send(JSON.stringify(userResponse));
						return false;
					}

					connection.query(userQuery,function(err, rows, fields) {
						connection.release();	

						if(err !== null) 
						{
							userResponse.result = false;
							userResponse.message = err;
						}
						else 
						{
							userResponse.result = true;

							if(msg.action === "list")
							{
								userResponse.count = rows.length;
								userResponse.usersList = rows;
							}	
						}

						client.socket.send(JSON.stringify(userResponse));	
					});
				});
			}

			if(msg.command == "hotel")
			{
				database.getConnection(function(err,connection)
				{
					if(err) 
					{
						connection.release();
						return false;
					}

					var hotelResponse = {};
					hotelResponse.command = "hotel";
					hotelResponse.requestId = msg.requestId;

					if(msg.action === "list")
					{
						var userQuery = "SELECT * FROM `idc hotel suite database`.Hotels;";
					}
					else if(msg.action === "add")
					{
						var userQuery = "SELECT * FROM `idc hotel suite database`.Users WHERE Users.UserEmail = '" + msg.loginData.userEmail + "'";
						hotelResponse.result = false;
						hotelResponse.message = "not_implemented";

						client.socket.send(JSON.stringify(hotelResponse));
						return false;
					}
					else if(msg.action === "update")
					{
						var userQuery = "SELECT * FROM `idc hotel suite database`.Users WHERE Users.UserEmail = '" + msg.loginData.userEmail + "'";
						hotelResponse.result = false;
						hotelResponse.message = "not_implemented";

						client.socket.send(JSON.stringify(hotelResponse));
						return false;
					}
					else if(msg.action === "delete")
					{
						var userQuery = "SELECT * FROM `idc hotel suite database`.Users WHERE Users.UserEmail = '" + msg.loginData.userEmail + "'";
						hotelResponse.result = false;
						hotelResponse.message = "not_implemented";

						client.socket.send(JSON.stringify(hotelResponse));
						return false;
					}
					else
					{
						hotelResponse.result = false;
						hotelResponse.message = "invalid_action";

						client.socket.send(JSON.stringify(hotelResponse));
						return false;
					}

					connection.query(userQuery,function(err, rows, fields) {
						connection.release();	

						if(err !== null) 
						{
							hotelResponse.result = false;
							hotelResponse.message = err;
						}
						else 
						{
							hotelResponse.result = true;

							if(msg.action === "list")
							{
								hotelResponse.count = rows.length;
								hotelResponse.hotelsList = rows;
							}	
						}

						client.socket.send(JSON.stringify(hotelResponse));	
					});
				});
			}

			if(msg.command == "preset")
			{
				database.getConnection(function(err,connection)
				{
					if(err) 
					{
						connection.release();
						return false;
					}

					var presetResponse = {};
					presetResponse.command = "preset";
					presetResponse.requestId = msg.requestId;

					if(msg.action === "list")
					{
						var userQuery = "SELECT * FROM `idc preset suite database`.presets;";
					}
					else if(msg.action === "add")
					{
						var userQuery = "SELECT * FROM `idc preset suite database`.Users WHERE Users.UserEmail = '" + msg.loginData.userEmail + "'";
						presetResponse.result = false;
						presetResponse.message = "not_implemented";

						client.socket.send(JSON.stringify(presetResponse));
						return false;
					}
					else if(msg.action === "update")
					{
						var userQuery = "SELECT * FROM `idc preset suite database`.Users WHERE Users.UserEmail = '" + msg.loginData.userEmail + "'";
						presetResponse.result = false;
						presetResponse.message = "not_implemented";

						client.socket.send(JSON.stringify(presetResponse));
						return false;
					}
					else if(msg.action === "delete")
					{
						var userQuery = "SELECT * FROM `idc preset suite database`.Users WHERE Users.UserEmail = '" + msg.loginData.userEmail + "'";
						presetResponse.result = false;
						presetResponse.message = "not_implemented";

						client.socket.send(JSON.stringify(presetResponse));
						return false;
					}
					else
					{
						presetResponse.result = false;
						presetResponse.message = "invalid_action";

						client.socket.send(JSON.stringify(presetResponse));
						return false;
					}

					connection.query(userQuery,function(err, rows, fields) {
						connection.release();	

						if(err !== null) 
						{
							presetResponse.result = false;
							presetResponse.message = err;
						}
						else 
						{
							presetResponse.result = true;

							if(msg.action === "list")
							{
								presetResponse.count = rows.length;
								presetResponse.presetsList = rows;
							}	
						}

						client.socket.send(JSON.stringify(presetResponse));	
					});
				});
			}

			if(msg.command == "room")
			{
				database.getConnection(function(err,connection)
				{
					if(err) 
					{
						connection.release();
						return false;
					}

					var roomResponse = {};
					roomResponse.command = "room";
					roomResponse.requestId = msg.requestId;

					if(msg.action === "list")
					{
						var userQuery = "SELECT * FROM `idc room suite database`.rooms;";
					}
					else if(msg.action === "add")
					{
						var userQuery = "SELECT * FROM `idc room suite database`.Users WHERE Users.UserEmail = '" + msg.loginData.userEmail + "'";
						roomResponse.result = false;
						roomResponse.message = "not_implemented";

						client.socket.send(JSON.stringify(roomResponse));
						return false;
					}
					else if(msg.action === "update")
					{
						var userQuery = "SELECT * FROM `idc room suite database`.Users WHERE Users.UserEmail = '" + msg.loginData.userEmail + "'";
						roomResponse.result = false;
						roomResponse.message = "not_implemented";

						client.socket.send(JSON.stringify(roomResponse));
						return false;
					}
					else if(msg.action === "delete")
					{
						var userQuery = "SELECT * FROM `idc room suite database`.Users WHERE Users.UserEmail = '" + msg.loginData.userEmail + "'";
						roomResponse.result = false;
						roomResponse.message = "not_implemented";

						client.socket.send(JSON.stringify(roomResponse));
						return false;
					}
					else
					{
						roomResponse.result = false;
						roomResponse.message = "invalid_action";

						client.socket.send(JSON.stringify(roomResponse));
						return false;
					}

					connection.query(userQuery,function(err, rows, fields) {
						connection.release();	

						if(err !== null) 
						{
							roomResponse.result = false;
							roomResponse.message = err;
						}
						else 
						{
							roomResponse.result = true;

							if(msg.action === "list")
							{
								roomResponse.count = rows.length;
								roomResponse.roomsList = rows;
							}	
						}

						client.socket.send(JSON.stringify(roomResponse));	
					});
				});
			}

			if(msg.command == "reservation")
			{
				database.getConnection(function(err,connection)
				{
					if(err) 
					{
						connection.release();
						return false;
					}

					var reservationResponse = {};
					reservationResponse.command = "reservation";
					reservationResponse.requestId = msg.requestId;

					if(msg.action === "list")
					{
						var userQuery = "SELECT * FROM `idc reservation suite database`.reservations;";
					}
					else if(msg.action === "add")
					{
						var userQuery = "SELECT * FROM `idc reservation suite database`.Users WHERE Users.UserEmail = '" + msg.loginData.userEmail + "'";
						reservationResponse.result = false;
						reservationResponse.message = "not_implemented";

						client.socket.send(JSON.stringify(reservationResponse));
						return false;
					}
					else if(msg.action === "update")
					{
						var userQuery = "SELECT * FROM `idc reservation suite database`.Users WHERE Users.UserEmail = '" + msg.loginData.userEmail + "'";
						reservationResponse.result = false;
						reservationResponse.message = "not_implemented";

						client.socket.send(JSON.stringify(reservationResponse));
						return false;
					}
					else if(msg.action === "delete")
					{
						var userQuery = "SELECT * FROM `idc reservation suite database`.Users WHERE Users.UserEmail = '" + msg.loginData.userEmail + "'";
						reservationResponse.result = false;
						reservationResponse.message = "not_implemented";

						client.socket.send(JSON.stringify(reservationResponse));
						return false;
					}
					else
					{
						reservationResponse.result = false;
						reservationResponse.message = "invalid_action";

						client.socket.send(JSON.stringify(reservationResponse));
						return false;
					}

					connection.query(userQuery,function(err, rows, fields) {
						connection.release();	

						if(err !== null) 
						{
							reservationResponse.result = false;
							reservationResponse.message = err;
						}
						else 
						{
							reservationResponse.result = true;

							if(msg.action === "list")
							{
								reservationResponse.count = rows.length;
								reservationResponse.reservationsList = rows;
							}	
						}

						client.socket.send(JSON.stringify(reservationResponse));	
					});
				});
			}
	}
}

function setUserPermissionLevel(data)
{
	data.UserId = "AUX12345";
	data.UserPermissionLevel = "superadmin";
}