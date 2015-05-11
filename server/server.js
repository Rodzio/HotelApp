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
			console.log("Client " + client.id + " sent message. Command: " + msg.command + ". Action: " + msg.action);
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
					if(connection == null)
					{
						response.result = false;
						response.message = "database_offline";

						client.socket.send(JSON.stringify(response));
						return false;
					}

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
					if(connection == null)
					{
						response.result = false;
						response.message = "database_offline";

						client.socket.send(JSON.stringify(response));
						return false;
					}

					if(err) 
					{
						connection.release();
						return false;
					}
					
					//to avoid undefined
					if(msg.registerData.userHotelId == null) msg.registerData.userHotelId = null;

					var registerQuery = "INSERT INTO `idc hotel suite database`.`users` VALUES ('" + msg.registerData.userId + "','" + msg.registerData.userPermissionLevel + "','" + msg.registerData.userFirstName + "','" + msg.registerData.userSecondName + "','" + msg.registerData.userLastName + "','" + msg.registerData.userEmail + "','" + msg.registerData.userPasswordHash + "'," + msg.registerData.userHotelId + ");";
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
			}

			if(msg.command == "permissionLevel")
			{
				database.getConnection(function(err,connection)
				{
					if(connection == null)
					{
						var response = {};
						response.result = false;
						response.message = "database_offline";

						client.socket.send(JSON.stringify(response));
						return false;
					}

					if(err) 
					{
						connection.release();
						return false;
					}

					var permissionLevelResponse = {};
					permissionLevelResponse.command = "permissionLevel";
					permissionLevelResponse.requestId = msg.requestId;
					permissionLevelResponse.action = msg.action;

					if(msg.action === "get")
					{
						var permissionLevelQuery = "SELECT * FROM `idc hotel suite database`.UserPermissionLevels;";
					}
					else if(msg.action === "add")
					{
						var permissionLevelQuery = "INSERT INTO `idc hotel suite database`.UserPermissionLevels (ManageHotels, ManageRooms, ManageGuests, ManageEmployees, ManageReservations, UserPermissionsLevelName) VALUES ("+
							+""+msg.ManageHotels+","+
							+""+msg.ManageRooms+","+
							+""+msg.ManageGuests+","+
							+""+msg.ManageEmployeess+","+
							+""+msg.ManageReservations+","+
							+"'"+msg.UserPermissionsLevelName+"',"+
							+")";
					}
					else if(msg.action === "update")
					{
						var permissionLevelQuery = "UPDATE `idc hotel suite database`.UserPermissionLevels SET " + 
						+"ManageHotels = "+ msg.ManageHotels
						+", ManageRooms = "+ msg.ManageRooms
						+", ManageGuests = "+ msg.ManageGuests
						+", ManageEmployees = "+ msg.ManageEmployees
						+", ManageReservations = "+ msg.ManageReservations
						+" WHERE UserPermissionsLevelName = '" + msg.UserPermissionsLevelName + "'";
					}
					else if(msg.action === "delete")
					{
						var permissionLevelQuery = "DELETE FROM `idc hotel suite database`.UserPermissionLevels WHERE UserPermissionsLevelName. = '" + msg.UserPermissionsLevelName + "'";
					}
					else
					{
						permissionLevelResponse.result = false;
						permissionLevelResponse.message = "invalid_action";

						client.socket.send(JSON.stringify(permissionLevelResponse));
						return false;
					}

					connection.query(permissionLevelQuery,function(err, rows, fields) {
						connection.release();	

						if(err !== null) 
						{
							permissionLevelResponse.result = false;
							permissionLevelResponse.message = err;
						}
						else 
						{
							permissionLevelResponse.result = true;

							if(msg.action === "get")
							{
								permissionLevelResponse.count = rows.length;
								permissionLevelResponse.list = rows;
							}	
						}

						client.socket.send(JSON.stringify(permissionLevelResponse));	
					});
				});
			}

			if(msg.command === "user")
			{
				database.getConnection(function(err,connection)
				{
					if(connection == null)
					{
						var response = {};
						response.result = false;
						response.message = "database_offline";

						client.socket.send(JSON.stringify(response));
						return false;
					}

					if(err) 
					{
						connection.release();
						return false;
					}

					var userResponse = {};
					userResponse.command = "user";
					userResponse.requestId = msg.requestId;
					userReponse.action = msg.action;

					if(msg.action === "get")
					{
						var userQuery = "SELECT * FROM `idc hotel suite database`.Users;";
					}
					else if(msg.action === "update")
					{
						var userQuery = "UPDATE `idc hotel suite database`.Users SET " + 
						+ "UserPermissionLevelName = '" + msg.UserPermissionLevelName + "'," +
						+ "UserFirstName = '" + msg.UserFirstName + "'," +
						+ "UserSecondName = '" + msg.UserSecondName + "'," +
						+ "UserLastName = '" + msg.UserLastName + "'," +
						+ "UserEmail = '" + msg.UserEmail + "'," +
						+ "UserPasswordHash = '" + msg.UserPasswordHash + "'," +
						+ "UserHotelId = " + msg.UserHotelId + "," +
						+ "' WHERE UserId = '" + msg.UserId + "';";
					}
					else if(msg.action === "delete")
					{
						var userQuery = "DELETE FROM `idc hotel suite database`.Users WHERE UserId = '" + msg.UserId + "'";
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

							if(msg.action === "get")
							{
								userResponse.count = rows.length;
								userResponse.list = rows;
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
					if(connection == null)
					{
						var response = {};
						response.result = false;
						response.message = "database_offline";

						client.socket.send(JSON.stringify(response));
						return false;
					}

					if(err) 
					{
						connection.release();
						return false;
					}

					var hotelResponse = {};
					hotelResponse.command = "hotel";
					hotelResponse.requestId = msg.requestId;
					hotelResponse.action = msg.action;

					if(msg.action === "get")
					{
						var hotelQuery = "SELECT * FROM `idc hotel suite database`.Hotels;";
					}
					else if(msg.action === "add")
					{
						var hotelQuery = "INSERT INTO `idc hotel suite database`.Hotels (HotelName, HotelCountry, HotelCity, HotelStreet, HotelRating, HotelEmail, HotelPhone) VALUES ("+
							+"'"+msg.HotelName+"',"+
							+"'"+msg.HotelCountry+"',"+
							+"'"+msg.HotelCity+"',"+
							+"'"+msg.HotelStreet+"',"+
							+""+msg.HotelRating+","+
							+"'"+msg.HotelEmail+"',"+
							+"'"+msg.HotelPhone+"'"+
							+")";
						console.log(hotelQuery);
					}
					else if(msg.action === "update")
					{
						var hotelQuery = "UPDATE `idc hotel suite database`.Hotels SET " + 
						+ "HotelName = '" + msg.HotelName + "'," +
						+ "HotelCountry = '" + msg.HotelCountry + "'," +
						+ "HotelCity = '" + msg.HotelCity + "'," +
						+ "HotelStreet = '" + msg.HotelStreet + "'," +
						+ "HotelRating = " + msg.HotelRating + "," +
						+ "HotelEmail = '" + msg.HotelEmail + "'," +
						+ "HotelPhone = '" + msg.HotelPhone + "'," +
						+ "' WHERE HotelId = " + msg.HotelId + ";";
					}
					else if(msg.action === "delete")
					{
						var hotelQuery = "DELETE FROM `idc hotel suite database`.Hotels WHERE HotelId. = " + msg.HotelId + "";
					}
					else
					{
						hotelResponse.result = false;
						hotelResponse.message = "invalid_action";

						client.socket.send(JSON.stringify(hotelResponse));
						return false;
					}

					connection.query(hotelQuery,function(err, rows, fields) {
						connection.release();	

						if(err !== null) 
						{
							console.log(err);
							hotelResponse.result = false;
							hotelResponse.message = err;
						}
						else 
						{
							hotelResponse.result = true;

							if(msg.action === "get")
							{
								hotelResponse.count = rows.length;
								hotelResponse.list = rows;
							}	
						}

						client.socket.send(JSON.stringify(hotelResponse));	
					});
				});
			}

			if(msg.command == "template")
			{
				database.getConnection(function(err,connection)
				{
					if(connection == null)
					{
						var response = {};
						response.result = false;
						response.message = "database_offline";

						client.socket.send(JSON.stringify(response));
						return false;
					}

					if(err) 
					{
						connection.release();
						return false;
					}

					var templateResponse = {};
					templateResponse.command = "template";
					templateResponse.requestId = msg.requestId;
					templateResponse.action = msg.action;

					if(msg.action === "get")
					{
						var userQuery = "SELECT * FROM `idc template suite database`.RoomTemplates;";
					}
					else if(msg.action === "add")
					{
						var templateQuery = "INSERT INTO `idc hotel suite database`.RoomTemplates (TemplateId, RoomTemplateName, RoomTemplateCost, RoomTemplateDescription) VALUES ("+
							+"'"+msg.TemplateId+"',"+
							+"'"+msg.RoomTemplateName+"',"+
							+""+msg.RoomTemplateCost+","+
							+"'"+msg.RoomTemplateDescription+"',"+
							+")";
					}
					else if(msg.action === "update")
					{
						var templateQuery = "UPDATE `idc hotel suite database`.RoomTemplates SET " + 
						+ "RoomTemplateName = '" + msg.RoomTemplateName + "'," +
						+ "RoomTemplateCost = " + msg.RoomTemplateCost + "," +
						+ "RoomTemplateDescription = '" + msg.RoomTemplateDescription + "'," +
						+ "' WHERE TemplateId = '" + msg.TemplateId + "';";
					}
					else if(msg.action === "delete")
					{
						var templateQuery = "DELETE FROM `idc hotel suite database`.RoomTemplates WHERE TemplateId = '" + msg.TemplateId + "'";
					}
					else
					{
						templateResponse.result = false;
						templateResponse.message = "invalid_action";

						client.socket.send(JSON.stringify(templateResponse));
						return false;
					}

					connection.query(templateQuery,function(err, rows, fields) {
						connection.release();	

						if(err !== null) 
						{
							templateResponse.result = false;
							templateResponse.message = err;
						}
						else 
						{
							templateResponse.result = true;

							if(msg.action === "get")
							{
								templateResponse.count = rows.length;
								templateResponse.list = rows;
							}	
						}

						client.socket.send(JSON.stringify(templateResponse));	
					});
				});
			}

			if(msg.command == "room")
			{
				database.getConnection(function(err,connection)
				{
					if(connection == null)
					{
						var response = {};
						response.result = false;
						response.message = "database_offline";

						client.socket.send(JSON.stringify(response));
						return false;
					}

					if(err) 
					{
						connection.release();
						return false;
					}

					var roomResponse = {};
					roomResponse.command = "room";
					roomResponse.requestId = msg.requestId;
					roomResponse.action = msg.action;

					if(msg.action === "get")
					{
						var roomQuery = "SELECT * FROM `idc room suite database`.rooms;";
					}
					else if(msg.action === "add")
					{
						var roomQuery = "INSERT INTO `idc hotel suite database`.Rooms (HotelId, RoomNumber, TemplateId) VALUES ("+
							+""+msg.HotelId+","+
							+""+msg.RoomNumber+","+
							+"'"+msg.TemplateId+"',"+
							+")";
					}
					else if(msg.action === "update")
					{
						var roomQuery = "UPDATE `idc hotel suite database`.Rooms SET " + 
						+"TemplateId = '"+ TemplateId
						+"' WHERE HotelId = " + msg.HotelId + " AND RoomNumber = " + msg.RoomNumber + "";
					}
					else if(msg.action === "delete")
					{
						var roomQuery = "DELETE FROM `idc hotel suite database`.Rooms WHERE HotelId = " + msg.HotelId + " AND RoomNumber = " + msg.RoomNumber + "";
					}
					else
					{
						roomResponse.result = false;
						roomResponse.message = "invalid_action";

						client.socket.send(JSON.stringify(roomResponse));
						return false;
					}

					connection.query(roomQuery,function(err, rows, fields) {
						connection.release();	

						if(err !== null) 
						{
							roomResponse.result = false;
							roomResponse.message = err;
						}
						else 
						{
							roomResponse.result = true;

							if(msg.action === "get")
							{
								roomResponse.count = rows.length;
								roomResponse.list = rows;
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
					if(connection == null)
					{
						var response = {};
						response.result = false;
						response.message = "database_offline";

						client.socket.send(JSON.stringify(response));
						return false;
					}

					if(err) 
					{
						connection.release();
						return false;
					}

					var reservationResponse = {};
					reservationResponse.command = "reservation";
					reservationResponse.requestId = msg.requestId;
					reservationResponse.action = msg.action;

					if(msg.action === "get")
					{
						var reservationQuery = "SELECT * FROM `idc reservation suite database`.reservations;";
					}
					else if(msg.action === "add")
					{
						var reservationQuery = "INSERT INTO `idc hotel suite database`.Reservations (HotelId, RoomNumber, UserId, ReservationCheckIn, ReservationCheckOut) VALUES ("+
							+""+msg.HotelId+","+
							+""+msg.RoomNumber+","+
							+"'"+msg.UserId+"',"+
							+"'"+msg.ReservationCheckIn+"',"+
							+"'"+msg.ReservationCheckOut+"',"+
							+")";
					}
					else if(msg.action === "update")
					{
						var reservationQuery = "UPDATE `idc hotel suite database`.Reservations SET " + 
						+ "HotelId = " + msg.HotelId + "," +
						+ "RoomNumber = " + msg.RoomNumber + "," +
						+ "UserId = '" + msg.UserId + "'," +
						+ "ReservationCheckIn = '" + msg.ReservationCheckIn + "'," +
						+ "ReservationCheckOut= '" + msg.ReservationCheckOut+ "'," +
						+ "' WHERE ReservationId = " + msg.ReservationId + ";";
					}
					else if(msg.action === "delete")
					{
						var reservationQuery = "DELETE FROM `idc hotel suite database`.Reservations WHERE ReservationId = " + msg.ReservationId + "";
					}
					else
					{
						reservationResponse.result = false;
						reservationResponse.message = "invalid_action";

						client.socket.send(JSON.stringify(reservationResponse));
						return false;
					}

					connection.query(reservationQuery,function(err, rows, fields) {
						connection.release();	

						if(err !== null) 
						{
							reservationResponse.result = false;
							reservationResponse.message = err;
						}
						else 
						{
							reservationResponse.result = true;

							if(msg.action === "get")
							{
								reservationResponse.count = rows.length;
								reservationResponse.list = rows;
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