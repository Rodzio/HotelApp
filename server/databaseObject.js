require('./serverSettings');
var mysql = require('mysql');
var database;

var host = 'localhost';
var user = 'root';
var password = '';

module.exports.database = database;

function connectToDatabase(host, user, password)
{
	var con = mysql.createConnection({
	  host     : host,
	  user     : user,
	  password : password
	});

	con.connect();
	return con;
}

database = connectToDatabase(host, user, password);

database.query('SELECT 1 + 5 AS solution', function(err, rows, fields) {
  if (err) throw err;

  if(serverSettings.databaseLogging === true) 
  	console.log('The solution is: ', rows[0].solution);
});

//required for login
function getUserInfo()
{

}

//required for registration
function addNewUser()
{
	
}