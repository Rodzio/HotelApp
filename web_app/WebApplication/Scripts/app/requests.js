//var connection = new WebSocket("ws://83.145.169.112:9009");
//var string = '{"command":"hotel","action":"get"}';

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

//var getHotels = function () {
//    string = '{"command":"hotel","action":"get"}';
//};

//var getRooms = function () {
//    string = '{"command":"room","action":"get"}';
//};

//var getReservation = function () {
//    string = '{"command":"reservation","action":"get"}';
//};

//var alterReservation = function (data, action) { //data jest obiektem
//    var temp = JSON.stringify(data);
//    temp = temp.replace('{', ',');
//    string = '{"command":"reservation","action":"' + action + '"' + temp;
//    var sent = false;
//    var json = JSON.stringify(eval('(' + string + ')'));
//};

//var data = {
//    HotelId: 1,
//    ReservationCheckIn: "2015-03-25",
//    ReservationCheckOut: "2015-03-31",
//    ReservationId: 1,
//    RoomNumber: 1,
//    UserId: "B906512"
//};
//alterReservation(data, 'update');
//alterReservation(data, 'add');
//getHotels();
//getRooms();
//getReservation();
