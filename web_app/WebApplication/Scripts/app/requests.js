var aaaconnection = new WebSocket("ws://83.145.184.80:9009/");
var resString = '{"command":"room","action":"get"}';
var loginString = '{"command":"reservation","action":"get"}';
var string = '{"command":"template","action":"get"}';
var roomData;
var reservationData;
var templateData;

aaaconnection.onerror = function (error) {
    console.log('WebSocket Error ' + error);
};

aaaconnection.onopen = function () {
    aaaconnection.send(loginString);
};

aaaconnection.onmessage = function (e) {
    var u = JSON.stringify(eval('(' + e.data + ')'))
    json = JSON.parse(u);
    if (json.command === "reservation") {
        aaaconnection.send(resString);
        reservationData = json;
    } else if (json.command === "room") {
        aaaconnection.send(string);
        roomData = json;
    } else {
        templateData = json;
    }
    console.log(json); //json - obiekt
};