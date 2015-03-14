serverSettings = {};

serverSettings.listenPort = 8080;
serverSettings.connectionLogging = true;
serverSettings.clientMessagesLogging = true;
serverSettings.serverMessagesLogging = true;
serverSettings.databaseLogging = true;
//echo - returns whatever it gets from a client
//default - serving HotelApp API
serverSettings.mode = "echo";

module.exports.serverSettings = serverSettings;