var containers = [
    "hotels-content",
    "user-reservation-content"
];
var data;
var me = this;
var navigateData;

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
    if (con === "user-reservation-content") this.appendCallendar();
}

function reservationForm(button) {
    if (window.innerWidth < 800) {
        document.getElementById("have-reservation-content").style.width = "100%";
    }
    var prefix = button.split("-");
    document.getElementById(button.replace("button","content")).className = "container";
    document.getElementById(button.replace("-button","").replace(prefix[0],"container")).className = "container hidden";
    this.prepareRequest("new-reservation-content");
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

function enableInvoice() {
    document.getElementById("gb-input-cname").disabled = !document.getElementById("gb-input-cname").disabled;
    document.getElementById("gb-input-cin").disabled = !document.getElementById("gb-input-cin").disabled;
    document.getElementById("gb-input-caddr").disabled = !document.getElementById("gb-input-caddr").disabled;
    if (document.getElementById("gb-input-caddr").disabled && document.getElementById("gb-input-cin").disabled && document.getElementById("gb-input-cname").disabled) {
        document.getElementById("gb-input-cname").style.cssText = "font-weight: bold; background-color: rgb(65, 65, 65); color: #FFFFFF;";
        document.getElementById("gb-input-cin").style.cssText = "font-weight: bold; background-color: rgb(65, 65, 65); color: #FFFFFF;";
        document.getElementById("gb-input-caddr").style.cssText = "font-weight: bold; background-color: rgb(65, 65, 65); color: #FFFFFF;";
    } else {
        document.getElementById("gb-input-cname").style.cssText = "";
        document.getElementById("gb-input-cin").style.cssText = "";
        document.getElementById("gb-input-caddr").style.cssText = "";
    }
}

function appendCallendar() {
    $('#user-reservation-from').datepicker('update', '08-05-2015');
    $('#user-reservation-to').datepicker('update', '15-05-2015');
}

function navRoomDetail(button) {
    var divs = document.getElementById("room-container").querySelectorAll("div[target]"),
        j = 0,
        i = 0;
    if (button === "next") {
        for (i = j; i < divs.length; i++) {
            if (i === divs.length - 1) break;
            if (divs[i].className === "panel") {
                divs[i].className = "panel hidden";
                divs[i + 1].className = "panel";
                j = i;
                if (i === 0) this.doRequest("room", "get");
                break;
            }
        }
    }
    if (button === "prev") {
        j = divs.length - 1;
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
        if (button === "next") {
            for (i = j; i < divs.length; i++) {
                if (i === divs.length - 1) {
                    document.getElementById("room-container").className = "col-md-12";
                    document.getElementById("hotel-container").className = "col-md-12 hidden";
                    this.doRequest("template", "get");
                    break;
                }
                if (divs[i].className === "panel") {
                    divs[i].className = "panel hidden";
                    divs[i + 1].className = "panel";
                    j = i;
                    break;
                }
            }
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
        }
}

function reservationFormSubmit() {
    var request = "reservation";
    var action = "add";
    this.doRequest(request, action);
}

function prepareRequest(container) {
    var request;
    var action = "get";
    if (container === "hotels-content") request = "hotel";
    if (container === "new-reservation-content") request = "hotel";
    if (container === "user-reservation-content") request = "reservation";
    this.doRequest(request, action);
}

function doRequest(request, action) {
    if (action === "add" || action === "update") {

    } else {
        var connection = new WebSocket("ws://83.145.169.112:9009");
        var string = '{"command":"' + request + '","action":"' + action + '"}';

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
        this.setCity(data);
    }
    if (request === "template") {
        this.setTemplate(data);
    }
    if (request === "room") {
        this.setSize(data);
    }
}

function setCountry(data) {
    for (var i = 0; i < data.count; i++){
        var string = '<div><label class="btn btn-primary  btn-block"><input type="radio" name="options" id="' + data.list[i].HotelCountry + '" autocomplete="off">' + data.list[i].HotelCountry + '</label></div>';
        document.getElementById("region-radio").innerHTML += string;
    }
}

function setCity(data) {
    for (var i = 0; i < data.count; i++) {
        var string = '<div><label class="btn btn-primary  btn-block"><input type="radio" name="options" id="' + data.list[i].HotelCity + '" autocomplete="off">' + data.list[i].HotelCity + '</label></div>'
        document.getElementById("city-radio").innerHTML += string;
    }
}

function setTemplate(data) {
    for (var i = 0; i < data.count; i++) {
        var string = '<div><label class="btn btn-primary  btn-block"><input type="radio" name="options" id="' + data.list[i].TemplateId + '" autocomplete="off">' + data.list[i].RoomTemplateName + '</label></div>'
        document.getElementById("type-radio").innerHTML += string;
    }
}

function setSize(data) {
    for (var i = 0; i < data.count; i++) {
        var string = '<div><label class="btn btn-primary  btn-block"><input type="radio" name="options" id="size' + data.list[i].RoomNumber + '" autocomplete="off">' + data.list[i].RoomNumber + '. osobowy</label></div>'
        document.getElementById("size-radio").innerHTML += string;
    }
}

