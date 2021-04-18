function doLogin() {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    email = document.getElementById("loginMail").value;
    if (re.test(email.toLowerCase())) {
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
    window.location.href = "./profile.html";
}
