var containers = [
    "hotels-content",
    "user-reservation-content"
];

var data;
var hotelData;
//var templateData;
//var roomData;
//var reservationData;
var room, template, hotel;
var newReservationData;
var user;
var reserving = false;
var reserved = false;
var changing = false;
var me = this;
var registerData;
var loginData;
var hotelCount = 0;
var cityCount = 0;
var templateCount = 0;
var sizeCount = 0;
var co, ho, ro, te;
var resString;
var reservationCount = 0;
var reservations = [];

function navPage(navButton) {
    var act = document.getElementsByClassName("active"),
        hcon = document.getElementsByClassName("container"),
        con = navButton.replace("button", "content");

    document.getElementById("container-reservation").className = "container";
    document.getElementById("container-guestbook").className = "container";

    for (var i = 0; i < hcon.length; i++) {
        if (hcon[i].className === "container") {
            hcon[i].className = "container hidden";
            if (hcon[i].id === "container-reservation" || hcon[i].id === "container-guestbook") {
                hcon[i].className = "container";
            }
        }
    }
    for (var j = 0; j < act.length; j++) {
        act[j].className = "inactive";
    }
    if (navButton === "new-form-button") {
        if (changing) {
            this.showChangeForm();
        }
        this.showReservationForm();
    }
    if (document.getElementById(navButton) !== null) document.getElementById(navButton).className = "active";
    document.getElementById(con).className = "container";
    for (var k = 0; k < containers.length; k++) {
        if (con === (containers[k])) this.prepareRequest(containers[k]);
    }
}

function reservationForm(button) {
    if (window.innerWidth < 800) {
        document.getElementById("have-reservation-content").style.width = "100%";
    }
    var prefix = button.split("-");
    document.getElementById(button.replace("button", "content")).className = "container";
    document.getElementById(button.replace("-button", "").replace(prefix[0], "container")).className = "container hidden";
    this.prepareRequest("new-reservation-content");
}

function login(mail, psswd) {
    if (document.getElementById("r-input-email").value !== "" && document.getElementById("r-input-password").value !== "") {
        loginData = {
            userEmail: document.getElementById("r-input-email").value,
            userPasswordHash: document.getElementById("r-input-password").value
        };
        var temp = JSON.stringify(loginData);
        logString = '{"command":"login","loginData":' + temp + '}';
        var logconnection = new WebSocket("ws://83.145.184.80:9009");
        logconnection.onerror = function (error) {
            console.log('WebSocket Error ' + error);
        };

        logconnection.onopen = function () {
            logconnection.send(logString);
        };

        logconnection.onmessage = function (e) {
            if (reserving) logconnection.send(me.reservationFormSubmit());
            reserving = false;
            console.log(e.data);
            var u = JSON.stringify(eval('(' + e.data + ')'))
            json = JSON.parse(u);
            data = json;
            if (data.result) {
                var u = JSON.stringify(eval('(' + e.data + ')'))
                json = JSON.parse(u);
                data = json;
                user = data.info.UserId;
                me.getReservation();
            } else {
                //me.register();
            }
        };
    } else {
        if (mail !== '' && psswd !== '') {
            loginData = {
                userEmail: mail,
                userPasswordHash: psswd
            };
            var temp = JSON.stringify(loginData);
            var logString = '{"command":"login","loginData":' + temp + '}';
            var loconnection = new WebSocket("ws://83.145.184.80:9009");
            loconnection.onerror = function (error) {
                console.log('WebSocket Error ' + error);
            };

            loconnection.onopen = function () {
                loconnection.send(logString);
            };

            loconnection.onmessage = function (e) {
                if (!reserved) {
                    if (reserving) loconnection.send(me.reservationFormSubmit());
                    reserving = false;
                    console.log(e.data);
                    var u = JSON.stringify(eval('(' + e.data + ')'))
                    json = JSON.parse(u);
                    data = json;
                    if (data.result) {
                        var u = JSON.stringify(eval('(' + e.data + ')'))
                        json = JSON.parse(u);
                        data = json;
                        if (data.command === "login") user = data.info.UserId;
                        reserved = true;
                    } else {
                        //me.register();
                    }
                }
                if (data.result) {
                    var u = JSON.stringify(eval('(' + e.data + ')'))
                    json = JSON.parse(u);
                    data = json;
                    user = data.info.UserId;
                    me.getReservation();
                }
            };
        }
    }
}

function register() {
    registerData = {
        userId: document.getElementById("gb-input-id").value,
        userPermissionLevel: "guest",
        userFirstName: document.getElementById("gb-input-fname").value,
        userSecondName: "",
        userLastName: document.getElementById("gb-input-lname").value,
        userEmail: document.getElementById("gb-input-email").value,
        userPasswordHash: document.getElementById("gb-input-psswd").value,
        userHotelId: ""
    };
    user = document.getElementById("gb-input-id").value;
    var connection = new WebSocket("ws://83.145.184.80:9009");
    var temp = JSON.stringify(registerData);
    var regString = '{"command":"register","registerData":' + temp + '}';
    connection.onerror = function (error) {
        console.log('WebSocket Error ' + error);
    };

    connection.onopen = function () {
        connection.send(regString);
    };

    connection.onmessage = function (e) {
        var u = JSON.stringify(eval('(' + e.data + ')'))
        json = JSON.parse(u);
        data = json;
        reserving = true;
        console.log(data);
        me.login(document.getElementById("gb-input-email").value, document.getElementById("gb-input-psswd").value);
        me.navPage('user-reservation-button');
    };
}

function guestbookForm(button) {
    if (window.innerWidth < 800) {
        document.getElementById("new-guestbook-content").style.width = "100%";
    }
    var prefix = button.split("-");
    document.getElementById(button.replace("button", "content")).className = "container";
    document.getElementById(button.replace("-button", "").replace(prefix[0], "container")).className = "container hidden";
    if (button === "view-guestbook-button") {
        this.viewGuestbookEntries();
    }
}

function guestbookEntrySubmit() {
    var entry = {
        email: document.getElementById("gb-input-email").value,
        fname: document.getElementById("gb-input-fname").value,
        lname: document.getElementById("gb-input-lname").value,
        text: document.getElementById("gb-input-entry").value
    }
    alert(entry.email + " " + entry.fname + " " + entry.lname + " " + entry.text);
}

function viewGuestbookEntries() {
    var string = '<div class="row" id="entries">';
    for (var i = 0; i < 3; i++) {
        string += '<div class="col-md-4"><h2>Person</h2><p>Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.</p></div>';
    }
    string += '</div>';
    document.getElementById("view-guestbook-content").innerHTML = string;
}

function navigateReservations(group, value, next) {
    document.getElementById(group).textContent = document.getElementById(value).textContent;
}

function showReservationForm() {
    if (window.innerWidth < 700) {
        document.getElementById("new-form-content").style.width = "100%";
    }
    document.getElementById("new-form-content").className = "container";
}

function showChangeForm() {
    if (window.innerWidth < 700) {
        document.getElementById("new-form-content").style.width = "100%";
    }
    document.getElementById("new-form-content").className = "container";
}

function appendCallendar(userDates, index) {
    $('#user-reservation-from-' + index).datepicker('update', userDates.from);
    $('#user-reservation-to-' + index).datepicker('update', userDates.to);
}

function navRoomDetail(button) {
    var divs = document.getElementById("room-container").querySelectorAll("div[target]"),
        j = 0,
        i = 0;
    if (button === "next") {
        for (i = j; i < divs.length; i++) {
            if (i === divs.length - 1) {
                document.getElementById("roomNext").className = "hidden";
                break;
            }
            if (divs[i].className === "panel") {
                divs[i].className = "panel hidden";
                divs[i + 1].className = "panel";
                j = i;
                if (i === 0) this.doRequest("room", "get", "");
                break;
            }
        }
    }
    if (i === divs.length - 2) {
        document.getElementById("roomNext").className = "hidden";
    }
    if (button === "prev") {
        j = divs.length - 1;
        document.getElementById("roomNext").className = "";
        for (var i = j; i > -1; i--) {
            if (i === 0) {
                document.getElementById("hotel-container").className = "col-md-12";
                document.getElementById("room-container").className = "col-md-12 hidden";
                break;
            }
            if (divs[i].className === "panel") {
                divs[i].className = "panel hidden";
                divs[i - 1].className = "panel";
                j = i;
                break;
            }
        }
    }
    for (var h = 0; h < document.getElementsByName("options template").length; h++) {
        if (document.getElementsByName("options template")[h].checked) {
            te = document.getElementsByName("options template")[h].id;
        }
    }
    for (var h = 0; h < document.getElementsByName("options room").length; h++) {
        if (document.getElementsByName("options room")[h].checked) ro = document.getElementsByName("options room")[h].id;
    }
}

function navHotelDetail(button) {
    var divs = document.getElementById("hotel-container").querySelectorAll("div[target]")
    j = 0,
    i = 0;
    for (var h = 0; h < document.getElementsByName("options country").length; h++) {
        if (document.getElementsByName("options country")[h].checked) co = document.getElementsByName("options country")[h].id
    }
    for (var h = 0; h < document.getElementsByName("options city").length; h++) {
        if (document.getElementsByName("options city")[h].checked) ho = document.getElementsByName("options city")[h].id
    }
    if (button === "next") {
        for (i = j; i < divs.length; i++) {
            if (i === divs.length - 1) {
                document.getElementById("room-container").className = "col-md-12";
                document.getElementById("hotel-container").className = "col-md-12 hidden";
                this.doRequest("template", "get", "");
                break;
            }
            if (divs[i].className === "panel") {
                divs[i].className = "panel hidden";
                divs[i + 1].className = "panel";
                j = i;
                break;
            }
        }
        document.getElementById("hotelPrev").className = "";
        this.getSelectedValue();
    }
    if (button === "prev") {
        j = divs.length - 1;
        for (var i = j; i > -1; i--) {
            if (i === 0) break;
            if (divs[i].className === "panel") {
                divs[i].className = "panel hidden";
                divs[i - 1].className = "panel";
                j = i;
                break;
            }
        }
        document.getElementById("hotelPrev").className = "hidden";
    }
}

function reservationFormSubmit() {
    for (var h = 0; h < document.getElementsByName("options room").length; h++) {
        if (document.getElementsByName("options room")[h].checked) ro = document.getElementsByName("options room")[h].id
    }
    var request = "reservation";
    var action = "add";
    var dates = this.parseDate(document.getElementById("from-date").value, document.getElementById("to-date").value);
    newReservationData = {
        HotelId: ho,
        RoomNumber: ro,
        UserId: document.getElementById("gb-input-id").value,
        ReservationCheckIn: dates.from,
        ReservationCheckOut: dates.to
    };
    var connection = new WebSocket("ws://83.145.184.80:9009");
    var temp = JSON.stringify(newReservationData);
    temp = temp.replace('{', ',');
    reserving = true;
    return resString = '{"command":"' + request + '","action":"' + action + '"' + temp;
}

function parseDate(f, t) {
    var dates = {
        from: f.replace("/", "-"),
        to: t.replace("/", "-")
    };
    dates = {
        from: dates.from.replace("/", "-"),
        to: dates.to.replace("/", "-")
    };
    return dates;
}

function getReservation() {
    var reconnection = new WebSocket("ws://83.145.184.80:9009");
    var string = '{"command":"reservation","action":"get"}';
    reconnection.onerror = function (error) {
        console.log('WebSocket Error ' + error);
    };

    reconnection.onopen = function () {
        reconnection.send(string);
    };

    reconnection.onmessage = function (e) {
        var u = JSON.stringify(eval('(' + e.data + ')'))
        json = JSON.parse(u);
        data = json;
        me.filterReservationInfo(data);
    };
}

function filterReservationInfo(data) {
    var temp = 0;
    for (var i = 0; i < data.count; i++) {
        for (var j = temp; j < data.count; j++) {
            if (data.list[j].UserId === user) {
                reservations[i] = data.list[j];
                temp = j + 1;
                break;
            }
        }
    }
    console.log(reservations);
    this.setReservationData(reservations);
}

function setReservationData(reservations) {
    var jumbos = document.getElementsByName("reservation-jumbo");
    var _hotel, _room;
    for (var j = 0; j < jumbos.length; j++) {
        jumbos[j].parentNode.removeChild(jumbos[j]);
    }
    for (var i = 0; i < reservations.length; i++) {
        var jumbo = this.templateStringJumbo(i);
        document.getElementById("user-reservation-content").innerHTML += jumbo;
        for (var h = 0; h < hotelData.count; h++) {
            if (hotelData.list[h].HotelId === reservations[i].HotelId) {
                _hotel = "<br>"+hotelData.list[h].HotelName + " ";
                for (var s = 0; s < hotelData.list[h].HotelRating; s++) _hotel += "*";
                _hotel += "</br>";
                _hotel += "<br>Country: " + hotelData.list[h].HotelCountry + "</br>";
                _hotel += "<br>City: " + hotelData.list[h].HotelCity + "</br>";
                _hotel += "<br>Street: " + hotelData.list[h].HotelStreet + "</br>";
                _hotel += "<br>Email: " + hotelData.list[h].HotelEmail + "</br>";
                _hotel += "<br>Phone number: " + hotelData.list[h].HotelPhone + "</br>";
            }
        }
        for (var r = 0; r < roomData.count; r++) {
            if (reservations[i].HotelId === roomData.list[r].HotelId && reservations[i].RoomNumber === roomData.list[r].RoomNumber) {
                var temp = roomData.list[r].TemplateId;
                for (var t = 0; t < templateData.count; t++) {
                    if (temp === templateData.list[t].TemplateId) {
                        _room = "<br>Room type: " + templateData.list[t].RoomTemplateName + "</br>";
                        _room += "<br>Description: " + templateData.list[t].RoomTemplateDescription + "</br>";
                        _room += "<br>One night cost: " + templateData.list[t].RoomTemplateCost + "</br>";
                    }
                }
            }
        }
        var hotelString = '<h2>Hotel</h2>' +
                            '<p>' +
                                _hotel +
                            '</p>';
        document.getElementById("hotel-info-" + i).innerHTML += hotelString;
        var roomString = '<h2>Room</h2>' +
                            '<p>' +
                                _room +
                            '</p>' +
                            '<div class="well">' +
                                '<ul class="x-ul row">' +
                                    '<li class="x-li col-lg-6 col-md-6 col-sm-6 col-xs-12">' +
                                        '<img class="x-img img-responsive" src="http://placehold.it/400x300">' +
                                    '</li>' +
                                    '<li class="x-li col-lg-6 col-md-6 col-sm-6 col-xs-12">' +
                                        '<img class="x-img img-responsive" src="http://placehold.it/400x300">' +
                                    '</li>' +
                                '</ul>' +
                            '</div>';
        document.getElementById("room-info-" + i).innerHTML += roomString;
        var dateToString = '<h3 style="text-align: center;">Until</h3>' +
                            '<div id="user-reservation-to-' + i + '" style="align-content: center;">' +
                            '<script>' +
                            'var toL = $("#user-reservation-to-' + i + '").datepicker({format: "dd/mm/yyyy",calendarWeeks: true});' +
                            '</script>' +
                            '</div>';
        var dateFromString = '<h3 style="text-align: center;">From</h3>' +
                            '<div id="user-reservation-from-' + i + '" style="align-content: center;">' +
                            '<script>' +
                            'var fromL = $("#user-reservation-from-' + i + '").datepicker({format: "dd/mm/yyyy",calendarWeeks: true});' +
                            '</script>' +
                            '</div>';
        document.getElementById("date-from-" + i).innerHTML = dateFromString;
        document.getElementById("date-to-" + i).innerHTML = dateToString;
        var dateFrom = this.splitDate(reservations[i].ReservationCheckIn);
        var dateTo = this.splitDate(reservations[i].ReservationCheckOut);
        var d = this.parseDate(dateFrom, dateTo);
        var dates = this.switchDates(d);
        this.appendCallendar(dates, i);

    }
    this.navPage('user-reservation-button');
    reservations = [];
}

function switchDates(d) {
    var sf = d.from.split("-");
    var st = d.to.split("-");
    d.from = sf[1] + "-" + sf[2] + "-" + sf[0];
    d.to = st[1] + "-" + st[2] + "-" + st[0];
    return d;
}

function splitDate(string) {
    var split = string.split("T");
    return split[0];
}

function getSelectedValue() {
    var options = document.getElementsByName("options country");
    for (var i = 0; i < options.length; i++) {
        if (options[i].checked) {
            var country = options[i].attributes[2].value;
            break;
        } else {
            var country = "";
        }
    }
    this.setCity(hotelData, country);
}

function prepareRequest(container) {
    var request;
    var action = "get";
    if (container === "hotels-content") request = "hotel";
    if (container === "new-reservation-content") request = "hotel";
    this.doRequest(request, action, "");
}

function doRequest(request, action, data) {
    if (typeof request !== 'undefined' && !changing) {
        if (action === "add" || action === "update") {
            var connection = new WebSocket("ws://83.145.184.80:9009");
            if (data !== "") {
                var temp = data;
                temp = temp.replace('{', ',');
                var string = '{"command":"' + request + '","action":"' + action + '"' + temp;
            } else var string = '{"command":"' + request + '","action":"' + action + '"}';

            connection.onerror = function (error) {
                console.log('WebSocket Error ' + error);
            };

            connection.onopen = function () {
                connection.send(string);
            };

            connection.onmessage = function (e) {
                var u = JSON.stringify(eval('(' + e.data + ')'))
                json = JSON.parse(u);
                data = json;
                me.navigateSetData(data, request);
            };
        } else {
            var connection = new WebSocket("ws://83.145.184.80:9009");
            if (data !== "") {
                var temp = data;
                temp = temp.replace('{', ',');
                var string = '{"command":"' + request + '","action":"' + action + '"' + temp;
            } else var string = '{"command":"' + request + '","action":"' + action + '"}';

            connection.onerror = function (error) {
                console.log('WebSocket Error ' + error);
            };

            connection.onopen = function () {
                connection.send(string);
            };

            connection.onmessage = function (e) {
                var u = JSON.stringify(eval('(' + e.data + ')'))
                json = JSON.parse(u);
                data = json;
                me.navigateSetData(data, request);
            };
        }
    }
}

function navigateSetData(data, request) {
    console.log(data, request);
    if (request === "hotel") {
        this.setCountry(data);
        hotelData = data;
    }
    if (request === "template") {
        this.setTemplate(data);
        templateData = data;
    }
    if (request === "room") {
        this.setRoom(data, te);
        roomData = data;
    }
    if (request === "reservation") {
        reservationData = data;
    }
}

function setCountry(data) {
    var i, j, temp;
    var elem = document.getElementsByName("options country");
    var t = elem.length;
    for (var i = t; i > 0; i--) {
        var kuc = elem[i - 1].parentNode;
        elem[i - 1].parentNode.parentNode.removeChild(kuc);
    }
    hotelData = data;
    var countries = [];
    countries[0] = data.list[0].HotelCountry;
    temp = 1;
    var string = '<div><label class="btn btn-primary  btn-block"><input type="radio" name="options country" id="' + data.list[0].HotelCountry + '" autocomplete="off">' + data.list[0].HotelCountry + '</label></div>';
    document.getElementById("region-radio").innerHTML += string;
    for (i = 0; i < data.count; i++) {
        for (j = temp; j < data.count; j++) {
            if (countries[i] !== data.list[j].HotelCountry) {
                countries[i + 1] = data.list[j].HotelCountry;
                var string = '<div><label class="btn btn-primary  btn-block"><input type="radio" name="options country" id="' + data.list[j].HotelCountry + '" autocomplete="off">' + data.list[j].HotelCountry + '</label></div>';
                document.getElementById("region-radio").innerHTML += string;
                break;
            }
        }
        temp = j;
    }
}

function setCity(data, country) {
    var elem = document.getElementsByName("options city");
    var t = elem.length;
    for (var i = t; i > 0; i--) {
        var kuc = elem[i - 1].parentNode;
        elem[i - 1].parentNode.parentNode.removeChild(kuc);
    }
    for (var i = 0; i < data.count; i++) {
        if (data.list[i].HotelCountry === country) {
            var string = '<div><label class="btn btn-primary  btn-block"><input type="radio" name="options city" id="' + data.list[i].HotelId + '" autocomplete="off">' + data.list[i].HotelCity + '</label></div>'
            document.getElementById("city-radio").innerHTML += string;
        }
        if (country === "") {
            var string = '<div><label class="btn btn-primary  btn-block"><input type="radio" name="options city" id="' + data.list[i].HotelId + '" autocomplete="off">' + data.list[i].HotelCity + '</label></div>'
            document.getElementById("city-radio").innerHTML += string;
        }
    }
}

function setTemplate(data) {
    templateData = data;
    var elem = document.getElementsByName("options template");
    var t = elem.length;
    for (var i = t; i > 0; i--) {
        var kuc = elem[i - 1].parentNode;
        elem[i - 1].parentNode.parentNode.removeChild(kuc);
    }
    for (var i = 0; i < data.count; i++) {
        var string = '<div><label class="btn btn-primary  btn-block"><input type="radio" name="options template" id="template-' + data.list[i].TemplateId + '" autocomplete="off">' + data.list[i].RoomTemplateName + '</label></div>'
        document.getElementById("type-radio").innerHTML += string;
    }
}

function setRoom(data, te) {
    var elem = document.getElementsByName("options room");
    var t = elem.length;
    for (var i = t; i > 0; i--) {
        var kuc = elem[i - 1].parentNode;
        elem[i - 1].parentNode.parentNode.removeChild(kuc);
    }
    for (var i = 0; i < data.count; i++) {
        if (data.list[i].TemplateId === te.split('-')[1] && data.list[i].HotelId == ho) {
            var string = '<div><label class="btn btn-primary  btn-block"><input type="radio" name="options room" id="' + data.list[i].RoomNumber + '" autocomplete="off">Room number ' + data.list[i].RoomNumber + '</label></div>'
            document.getElementById("size-radio").innerHTML += string;
        }
    }
}

function dropReservation(number) {
    var toDrop = {
        res: reservations[number].ReservationId,
        id: reservations[number].UserId
    };
    var connectionD = new WebSocket("ws://83.145.184.80:9009");
    var dropString = '{"command":"reservation","action":"delete","ReservationId":"' + toDrop.res + '","UserId":"' + toDrop.id + '"}';
    var loginString = '{"command":"login","loginData":{"userEmail":"' + loginData.userEmail + '","userPasswordHash":"' + loginData.userPasswordHash + '"}}';
    connectionD.onerror = function (error) {
        console.log('WebSocket Error ' + error);
    };

    connectionD.onopen = function () {
        connectionD.send(loginString);
    };

    connectionD.onmessage = function (e) {
        var u = JSON.stringify(eval('(' + e.data + ')'))
        json = JSON.parse(u);
        data = json;
        reserving = true;
        console.log(data);
        if (data.command === "login") {
            connectionD.send(dropString);
            var el = document.getElementById("rj"+number);
            el.parentNode.removeChild(el);
        }
        if (data.result) me.navPage('user-reservation-button');
    };
}

function templateStringJumbo(index) {
    var j = index + 1;
    var string = '<div class="jumbotron" name="reservation-jumbo" id="rj'+index+'">' +
                '<h1 style="text-align: center;">My reservation number ' + j + '</h1>' +
                '<div class="row">' +
                    '<div class="col-md-8">' +
                        '<h2 style="text-align: center;">Hotel & room informations</h2>' +
                    '</div>' +
                    '<div class="col-md-4">' +
                        '<h2 style="text-align: center;">Reservation dates</h2>' +
                    '</div>' +
                '</div>' +
                '<div class="row">' +
                    '<div class="col-md-8" id="user-hotel-info">' +
                        '<div id="hotel-info-' + index + '" class="row">' +

                        '</div>' +
                        '<div id="room-info-' + index + '" class="row">' +

                        '</div>' +
                    '</div>' +
                    '<div class="col-md-4" id="user-date-info">' +
                        '<div id="date-from-' + index + '" class="panel panel-default">' +

                        '</div>' +
                        '<div id="date-to-' + index + '" class="panel panel-default">' +

                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="btn-group btn-group-justified" role="group" aria-label="Justified button group">' +
                    '<div class="btn-group" role="group">' +
                        '<button type="button" class="btn btn-lg btn-primary btn-block" id="drop-reservation-button" onclick="dropReservation(' + index + ')">Drop this reservation</button>' +
                '</div>' +
                '</div>' +
            '</div>';
    return string;
}