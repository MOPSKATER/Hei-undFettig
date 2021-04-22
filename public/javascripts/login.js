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
                        displayLogin(data.prename + " " + data.name, data.points);
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

    //TODO hash password and send register request
    window.location.href = "./profile.html";
}

function checkMail(mail) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(email.toLowerCase()))
        return true
    return false
}
