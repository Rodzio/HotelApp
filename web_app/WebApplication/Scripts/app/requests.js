//var connection = new WebSocket("ws://83.145.169.112:9009/");
//var string = '{"command": "hello"}';
//connection.onerror = function (error) {
//    console.log('WebSocket Error ' + error);
//};

//connection.onopen = function () {
//    connection.send(string);
//};

//connection.onmessage = function (e) {
//    var u = JSON.stringify(eval('(' + e.data + ')'))
//    json = JSON.parse(u);
//    console.log(json); //json - obiekt
//};