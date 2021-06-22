
var data = {
    permission: 0,
    uid: undefined,
    tp: 0,
    prename: "",
    name: "",
    email: "",
    street: "",
    extra: "",
    plz: "",
    place: ""
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
                    data.prename = resp.prename !== undefined ? resp.prename : "";
                    data.name = resp.name !== undefined ? resp.name : "";
                    data.email = resp.email;
                    data.street = resp.street !== undefined ? resp.street : "";
                    data.plz = resp.plz !== undefined ? resp.plz : "";
                    data.place = resp.place !== undefined ? resp.place : "";
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
}

function submitForm() {
    // e.preventDefault();
    var data = {
        uid: window.data.uid,
        prename: document.getElementById("forename").value,
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        street: document.getElementById("address").value,
        plz: document.getElementById("plz").value,
        place: document.getElementById("city").value,
        permissionlevel: [5, 8, 10][document.getElementById("select").selectedIndex]
    }
    var password = document.getElementById("password").value
    var repeatPassword = document.getElementById("repeatPassword").value
    var valid = true;
    if (password !== repeatPassword) {
        valid = false;
        alert("Die Passw\u00f6rter stimmen nicht überein!");
    }
    Object.keys(data).forEach((key) => {
        if (data[key] == "" || data[key] == "Admin") delete data[key];
    })
    if (valid) {
        (async () => {
            if (password !== "" && password == repeatPassword) {
                await genHash(password, (hash) => { data.password = hash });
            }
            fetch('<%= api %>/api/account/set', { method: "PUT", body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' }, credentials: "include" })
                .then(async response => {
                    switch (response.status) {
                        case 200:
                            alert("Gespeichert!");
                            break;
                        default:
                            alert("Etwas ist schiefgegangen :(");
                            break;
                    }
                });
        })();

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
    document.getElementById("address").value = data.street;
    document.getElementById("extra").value = data.extra;
    document.getElementById("plz").value = data.plz;
    document.getElementById("city").value = data.place;
    document.getElementById("select").selectedIndex = index;
    document.getElementById("id").innerHTML = "ID: " + data.uid;
    document.getElementById("tp").innerHTML = "Treuepunkte: " + data.tp;
}

window.onload = load;

async function genHash(pass, callback) {
    callback(Array.prototype.map.call(new Uint8Array(
        await crypto.subtle.digest("SHA-256", new TextEncoder().encode(pass))),
        (x) => ("0" + x.toString(16)).slice(-2)).join(""));
}
