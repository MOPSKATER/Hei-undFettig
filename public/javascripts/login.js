function doLogin() {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    email = document.getElementById("loginMail").value;
    if (re.test(email.toLowerCase())) {
        displayLogin(email.split("@")[0], 0);
    }
    else {
        //TODO error: invalid e-mail
    }
}