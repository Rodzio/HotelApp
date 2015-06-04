var containers = [
    "hotels-content",
    "user-reservation-content"
];

var data;
var hotelData;
var templateData;
var roomData;
var reservationData;
var newReservationData;
var user;
var reserving = false;
var me = this;
var registerData;
var loginData;
var hotelCount = 0;
var cityCount = 0;
var templateCount = 0;
var sizeCount = 0;
var co, ho, ro;
var resString;

function navPage(navButton) {
    var act = document.getElementsByClassName("active"),
        hcon = document.getElementsByClassName("container"),
        con = navButton.replace("button","content");
        
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
    document.getElementById(button.replace("button","content")).className = "container";
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
        var connection = new WebSocket("ws://83.145.169.112:9009");
        connection.onerror = function (error) {
            console.log('WebSocket Error ' + error);
        };

        connection.onopen = function () {
            connection.send(logString);
            if (reserving) connection.send(me.reservationFormSubmit());
        };

        connection.onmessage = function (e) {
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
                me.register();
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
            var connection = new WebSocket("ws://83.145.169.112:9009");
            connection.onerror = function (error) {
                console.log('WebSocket Error ' + error);
            };

            connection.onopen = function () {
                connection.send(logString);
                if (reserving) connection.send(me.reservationFormSubmit());
            };

            connection.onmessage = function (e) {
                reserving = false;
                console.log(e.data);
                var u = JSON.stringify(eval('(' + e.data + ')'))
                json = JSON.parse(u);
                data = json;
                if (data.result) {
                    var u = JSON.stringify(eval('(' + e.data + ')'))
                    json = JSON.parse(u);
                    data = json;
                    if (data.info.UserId !== "undefined") user = data.info.UserId;
                } else {
                    me.register();
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
    var connection = new WebSocket("ws://83.145.169.112:9009");
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
        me.login(document.getElementById("gb-input-email").value, document.getElementById("gb-input-psswd").value);
    };
}

function guestbookForm(button) {
    if (window.innerWidth < 800) {
        document.getElementById("new-guestbook-content").style.width = "100%";
    }
    var prefix = button.split("-");
    document.getElementById(button.replace("button","content")).className = "container";
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
    alert(entry.email +" "+ entry.fname +" "+ entry.lname +" "+ entry.text);
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

function appendCallendar(userDates) {
    $('#user-reservation-from').datepicker('update', userDates.from);
    $('#user-reservation-to').datepicker('update', userDates.to);
}

function navRoomDetail(button) {
    var divs = document.getElementById("room-container").querySelectorAll("div[target]"),
        j = 0,
        i = 0;
    for (var h = 0; h < document.getElementsByName("options size").length; h++) {
        if (document.getElementsByName("options size")[h].checked) ro = document.getElementsByName("options size")[h].id
    }
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
    var connection = new WebSocket("ws://83.145.169.112:9009");
    var temp = JSON.stringify(newReservationData);
    temp = temp.replace('{', ',');
    reserving = true;
    return resString = '{"command":"' + request + '","action":"' + action + '"' + temp;

    //connection.onerror = function (error) {
    //    console.log('WebSocket Error ' + error);
    //};

    //connection.onopen = function () {
    //    connection.send(resString);
    //};

    //connection.onmessage = function (e) {
    //    var u = JSON.stringify(eval('(' + e.data + ')'))
    //    json = JSON.parse(u);
    //    data = json;
    //    if (data.result) {
    //        me.getReservation();
    //    }
    //};
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
    var connection = new WebSocket("ws://83.145.169.112:9009");
    var string = '{"command":"reservation","action":"get"}';
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
        me.filterReservationInfo(data);
    };
}

function filterReservationInfo(data) {
    var reservations = [];
    var temp = 0;
    for (var i = 0; i < data.count; i++) {
        for (var j = temp; j < data.count; j++) {
            if (data.list[j].UserId === user) {
                reservations[i] = data.list[j];
                temp = j+1;
                break;
            }
        }
    }
    console.log(reservations);
    this.setReservationData(reservations);
}

function setReservationData(reservations) {

    var hotelString = '<h3>Hotel</h3>' +
                        '<p>' +
                            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Proin nibh augue, suscipit a, scelerisque sed, lacinia in, mi.' +
                            'Cras vel lorem. Etiam pellentesque aliquet tellus.' +
                        '</p>';
    document.getElementById("hotel-info").innerHTML += hotelString;
    var roomString = '<h3>Room</h3>' +
                        '<p>' +
                            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Proin nibh augue, suscipit a, scelerisque sed, lacinia in, mi.' +
                            'Cras vel lorem. Etiam pellentesque aliquet tellus.' +
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
    document.getElementById("room-info").innerHTML += roomString;
    var dateToString = '<h3 style="text-align: center;">Until</h3>'+
                        '<div id="user-reservation-to" style="align-content: center;">'+
                        '<script>' +
                        'var to = $("#user-reservation-to").datepicker({format: "dd/mm/yyyy",calendarWeeks: true});' +
                        '</script>'+
                        '</div>';
    var dateFromString = '<h3 style="text-align: center;">From</h3>' +
                        '<div id="user-reservation-from" style="align-content: center;">' +
                        '<script>' +
                        'var from = $("#user-reservation-from").datepicker({format: "dd/mm/yyyy",calendarWeeks: true});' +
                        '</script>' +
                        '</div>';
    document.getElementById("date-from").innerHTML = dateFromString;
    document.getElementById("date-to").innerHTML = dateToString;
    var dateFrom = this.splitDate(reservations[0].ReservationCheckIn);
    var dateTo = this.splitDate(reservations[0].ReservationCheckOut);
    var d = this.parseDate(dateFrom, dateTo);
    var dates = this.switchDates(d);
    this.navPage('user-reservation-button');
    this.appendCallendar(dates);
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
    if (action === "add" || action === "update") {
        var connection = new WebSocket("ws://83.145.169.112:9009");
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
        var connection = new WebSocket("ws://83.145.169.112:9009");
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

function navigateSetData(data, request) {
    console.log(data, request);
    if (request === "hotel") {
        this.setCountry(data);
    }
    if (request === "template") {
        this.setTemplate(data);
    }
    if (request === "room") {
        this.setSize(data);
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
        var kuc = elem[i-1].parentNode;
        elem[i-1].parentNode.parentNode.removeChild(kuc);
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

function setSize(data) {
    var elem = document.getElementsByName("options size");
    var t = elem.length;
    for (var i = t; i > 0; i--) {
        var kuc = elem[i - 1].parentNode;
        elem[i - 1].parentNode.parentNode.removeChild(kuc);
    }
    for (var i = 0; i < data.count; i++) {
        var string = '<div><label class="btn btn-primary  btn-block"><input type="radio" name="options size" id="' + data.list[i].RoomNumber + '" autocomplete="off">' + data.list[i].RoomNumber + '. osobowy</label></div>'
        document.getElementById("size-radio").innerHTML += string;
    }
}