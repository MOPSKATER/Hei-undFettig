function doLogin() {
    email = document.getElementById("loginMail").value;
    if (checkMail(email)) {
        genHash(document.getElementById("loginPass").value, (hash) => {
        fetch('/api/account/login', { method: "POST", body: JSON.stringify({ email: email, password: hash }), headers: { 'Content-Type': 'application/json' }, credentials: "include" })
            .then(async response => {
                data = await response.json();
                switch (response.status) {
                    case 200:
                        console.log(data);
                        setJSONCookie("predict", { displayName: data.username, accessLevel: data.accessLevel, points: data.points, uid: data.uid });
                        break;

                        case 400:
                        case 401:
                            alert(JSON.stringify(data));
                            break;

                    default:
                        alert("interner Server Error")
                        break;
                }
                console.log(response.status);
            });
        });
    }
    else {
        //TODO error: invalid e-mail
        alert("Fehlerhafte Email");
    }
}

function register() {
    email = document.getElementById("registerMail").value;
    pass = document.getElementById("registerPass").value;

    // Is mail valid?
    if (!checkMail(email)) {
        //TODO error: invalid e-mail
        alert("fehlerhafte email");
        return
    }

    // Is password long enought?
    // FIXME >= 8
    if (pass.lenght < 8 || pass.lenght >= 8) {
        // error: password too short
        alert("passwort zu kurz");
        return
    }

    // Do passwords match?
    if (pass !== document.getElementById("registerPass2").value) {
        // error: passwords don't match
        alert("passwörter stimmen nicht überein");
        return
    }

    // hash password and send register request
    genHash(pass, (hash) => {
        var regData = { email: email, password: hash }
        fetch('/api/account/register', { method: "POST", body: JSON.stringify(regData), headers: { 'Content-Type': 'application/json' }, credentials: "include" })
            .then(async response => {
                switch (response.status) {
                    case 200:
                        data = await response.json();
                        console.log(data);
                        setJSONCookie("predict", { displayName: email, accessLevel: 5, points: 0, uid: data.uid });
                        // TODO: redirect to Profile for missing data
                        // window.location.href = "./profile.html";
                        break;

                    case 401:
                        //TODO wrong credentials error
                        break;

                    case 409:
                        // error: already exists
                        alert("user existiert bereits")
                        break;

                    default:
                        alert("interner Server Error")
                        break;
                }
        });
    })

}

function checkMail(mail) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(email.toLowerCase()))
        return true
    return false
}

async function genHash(pass, callback) {
    callback(Array.prototype.map.call(new Uint8Array(
        await crypto.subtle.digest("SHA-256", new TextEncoder().encode(pass))),
        (x) => ("0" + x.toString(16)).slice(-2)).join(""));
}

