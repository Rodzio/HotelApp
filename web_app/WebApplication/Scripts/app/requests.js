//var connection = new WebSocket("ws://83.145.169.112:9009/");
//var resString = '{"command": "hello"}';
//var loginString = '{"command":"login","loginData":{"userEmail":"komrad@cccp.cccp","userPasswordHash":"12345"}}'
//connection.onerror = function (error) {
//    console.log('WebSocket Error ' + error);
//};

//connection.onopen = function () {
//    connection.send(loginString);
//};

//connection.onmessage = function (e) {
//    var u = JSON.stringify(eval('(' + e.data + ')'))
//    json = JSON.parse(u);
//    //if (json.command === "login") connection.send(resString);
//    console.log(json); //json - obiekt
//};