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
    document.getElementById(navButton).className = "active";
    document.getElementById(con).className = "container";
}

function reservationForm(button) {
    if (window.innerWidth < 800) {
        document.getElementById("have-reservation-content").style.width = "100%";
    }
    var prefix = button.split("-");
    document.getElementById(button.replace("button","content")).className = "container";
    document.getElementById(button.replace("-button","").replace(prefix[0],"container")).className = "container hidden";
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