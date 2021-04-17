
var data = {
    permission: 9,
    id: 0,
    tp: 120,
    forename: "Peter",
    name: "Pan",
    email: "peterpan@invalide-email.com",
    address: "Beispielstr. 10",
    extra: "Erster Stock",
    plz: "72458",
    city: "Albstadt Ebingen"
}

function load() {
    // TODO: remove pseudo login
    displayLogin(data.forename + " " + data.name, data.tp);
    build(10, data);
    document.getElementById('data').onsubmit = function(e) {
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
            console.log(data);
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
    document.getElementById("forename").value = data.forename;
    document.getElementById("name").value = data.name;
    document.getElementById("email").value = data.email;
    document.getElementById("address").value = data.address;
    document.getElementById("extra").value = data.extra;
    document.getElementById("plz").value = data.plz;
    document.getElementById("city").value = data.city;
    document.getElementById("select").selectedIndex = index;
    document.getElementById("id").innerHTML = "ID #" + ("0000" + data.id).slice(-5);
    document.getElementById("tp").innerHTML = "Treuepunkte: " + data.tp;
}

window.onload = load;
