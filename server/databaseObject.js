var mysql = require('mysql');
require('./serverSettings'); //gives access to server settings like logging particular things

var host = 'localhost';
var user = 'root';
var password = '';

var database      =    mysql.createPool({
    connectionLimit : serverSettings.databaseConnectionLimit, //important
    host     : host,
    user     : user,
    password : password,
    database : 'idc hotel suite database',
    debug    :  false
});

/*
function connectToDatabase(host, user, password)
{
	var con = mysql.createConnection({
	  host     : host,
	  user     : user,
	  password : password
	});

	con.connect();
	return con;
}*/

//database = connectToDatabase(host, user, password);

/*
database.query('SELECT 1 + 5 AS solution', function(err, rows, fields) {
  if (err) throw err;

  if(serverSettings.databaseLogging === true) 
  	console.log('The solution is: ', rows[0].solution);
});
*/

//required for login
function getUserInfo()
{

}

//required for registration
function addNewUser()
{
	
}

module.exports = database;