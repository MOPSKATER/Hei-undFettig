
var data = {
    permission: 0,
    uid: undefined,
    tp: 0,
    prename: "",
    name: "",
    email: "",
    address: "",
    extra: "",
    plz: "",
    city: ""
}

var params = window.location.search.substring(1).split('&');
params.forEach((p) => {
    var pair = p.split('=');
    if (pair[0] == "uid") {
        data.uid = pair[1];
    }
});

function load() {
    if (!data.uid) data.uid = getJSONCookie("predict")["uid"];
    fetch('<%= api %>/api/user/' + data.uid, { method: "GET", headers: { 'Content-Type': 'application/json' }, credentials: "include" })
        .then(async response => {
            switch (response.status) {
                case 200:
                    resp = await response.json();
                    data.permission = resp.permissionlevel;
                    data.tp = resp.points;
                    data.prename = resp.prename === null ? resp.prename : "";
                    data.name = resp.name === null ? resp.name : "";
                    data.email = resp.email;
                    data.address = resp.street === null ? resp.street : "";
                    data.plz = resp.plz === null ? resp.plz : "";
                    data.city = resp.place === null ? resp.place : "";
                    build(data.permission, data);
                    break;

                // FIXME: correct error handling
                case 401:
                    //TODO unsufficient permissions error
                    break;

                case 404:
                    // error: exists not
                    alert("user existiert nicht")
                    break;

                default:
                    alert("interner Server Error")
                    break;
            }
        });
    document.getElementById('data').onsubmit = function (e) {
        e.preventDefault();
        var data = {
            name: document.getElementById("name").value,
            address: document.getElementById("address").value,
            password: document.getElementById("password").value,
            repeatPassword: document.getElementById("repeatPassword").value,
            index: document.getElementById("select").selectedIndex
        }
        var valid = true;
        if (data.password !== data.repeatPassword) {
            valid = false;
            alert("Die Passw\u00f6rter stimmen nicht überein!");
        }
        if (data.name === "" || data.address === "") {
            valid = false;
            alert("Keine leeren Felder erlaubt!");
        }
        if (valid) {
            // Passwort hash bilden (nur einmal senden; nicht data verwenden)
            // Änderungen an senden und Antwort erwarten
            alert("\u00c4nderungen gespeichert")
        }
        return false;
    }
}

function build(permission, data) {
    if (permission >= 10) {
        document.getElementById("select_box").removeAttribute("hidden");
    }
    var index = data.permission;
    if (data.permission === 9) index = 1;
    else if (data.permission === 10) index = 2;
    document.getElementById("forename").value = data.prename;
    document.getElementById("name").value = data.name;
    document.getElementById("email").value = data.email;
    document.getElementById("address").value = data.address;
    document.getElementById("extra").value = data.extra;
    document.getElementById("plz").value = data.plz;
    document.getElementById("city").value = data.city;
    document.getElementById("select").selectedIndex = index;
    document.getElementById("id").innerHTML = "ID: " + data.uid;
    document.getElementById("tp").innerHTML = "Treuepunkte: " + data.tp;
}

window.onload = load;
