
function load() {
    // TODO: remove pseudo login
    displayLogin("Peter Pan", 120);
    build(10, 1, 0);
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

function build(permission, id, tp) {
    if (permission >= 10) {
        document.getElementById("select_box").removeAttribute("hidden");
    }
    var name = "Peter Pan";
    var address = "Xstraße 19\nErster Stock (rechts)\nAlbstadt Ebingen";
    var index = 2;
    document.getElementById("name").value = name;
    document.getElementById("address").value = address;
    document.getElementById("select").selectedIndex = index;
    document.getElementById("id").innerHTML = "ID #" + ("00000" + id).slice(-5);
    document.getElementById("tp").innerHTML = "Treuepunkte: " + tp;
}

window.onload = load;
