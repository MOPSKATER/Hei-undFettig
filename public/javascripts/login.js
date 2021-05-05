function doLogin() {
    email = document.getElementById("loginMail").value;
    if (checkMail(email)) {
        data = { email: email, password: document.getElementById("loginPass").value }
        alert("Eingeloggt als Hermann Müller\n(Ausschließlich auf dieser Seite)");

        fetch('/api/account/login', { method: "POST", body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' }, credentials: "include" })
            .then(async response => {
                switch (response.status) {
                    case 200:
                        data = await response.json();
                        setJSONCookie("predict", { displayName: data.prename, accessLevel: data.accessLevel, points: data.points, uid: data.uid });
                        break;

                    case 401:
                        //TODO wrong credentials error
                        break;

                    default:
                        break;
                }
                console.log(response.status);
            });

    }
    else {
        //TODO error: invalid e-mail
        alert("fehlerhafte email");
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
    if (pass.lenght < 8) {
        //TODO error: password too short
        alert("passwort zu kurz");
        return
    }

    // Do passwords match?
    if (pass !== document.getElementById("registerPass2").value) {
        //TODO error: passwords don't match
        alert("passwörter stimmen nicht überein");
        return
    }

    // hash password and send register request
    var hashedPW;
    var hash = async () => Array.prototype.map
    .call(
        new Uint8Array(
        await crypto.subtle.digest("SHA-256", new TextEncoder().encode(pass))
    ),
    (x) => ("0" + x.toString(16)).slice(-2)
    ).join("");
    hash().then((x) => hashedPW = x);
    var regData = { email: email, password: hashedPW }
    fetch('/api/account/register', { method: "POST", body: JSON.stringify(regData), headers: { 'Content-Type': 'application/json' } })
    .then(async response => {
        switch (response.status) {
            case 200:
                data = await response.json();
                setJSONCookie("predict", { displayName: data.prename, accessLevel: data.accessLevel, points: data.points, uid: data.uid });
                break;

            case 409:
                //TODO error: already exists
                alert("user existiert bereits")
                return;

            default:
                return;
        }
        console.log(response.status);
    });

    // redirect to Profile for missing data
    window.location.href = "./profile.html";
}

function checkMail(mail) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(email.toLowerCase()))
        return true
    return false
}

