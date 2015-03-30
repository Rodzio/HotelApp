serverSettings = {};

serverSettings.listenPort = 9009;
serverSettings.databaseConnectionLimit = 100;
serverSettings.connectionLogging = true;
serverSettings.clientMessagesLogging = true;
serverSettings.serverMessagesLogging = true;
serverSettings.databaseLogging = true;
//echo - returns whatever it gets from a client
//default - serving HotelApp API
serverSettings.mode = "default";

module.exports.serverSettings = serverSettings;