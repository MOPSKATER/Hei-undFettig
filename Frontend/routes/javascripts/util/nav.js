function addUnderline(obj) {
    obj.children[0].style.textDecoration = "underline";
}

function removeUnderline(obj) {
    obj.children[0].style.textDecoration = "";
}

function toggleControl() {
    fetch('http://<%= api %>/api/account/isLoggedin', { method: "GET" })
            .then(async response => {
                var profile = getJSONCookie("predict");
                switch (response.status) {
                    case 200:
                        if (profile) {
                            displayLogin(profile.displayName, profile.points);
                        }
                        else {
                            displayLogout()
                        }
                        break;

                    case 401:
                    default:
                        delCookie("predict");
                        break;
                }
                console.log(response.status);
            });
    panel = document.getElementById("controlPanel");
    if (panel.style.display === "block")
        panel.style.display = "none";
    else
        panel.style.display = "block";
}

function displayLogin(name, points) {
    document.getElementById("summary").innerHTML = name + "<br>Treuepunkte: " + points;
    document.getElementById("profilLink").style.display = "block";
    login = document.getElementById("login");
    login.innerHTML = "<u>Logout</u>";
    login.href = "javascript:displayLogout()";
}
function displayLogout() {
    fetch('http://<%= api %>/api/account/logout', { method: "POST", headers: { 'Content-Type': 'application/json' }, credentials: "include" })
            .then(async response => {
                switch (response.status) {
                    case 200:
                        console.log("log-out succesfull");
                        break;

                    case 500:
                    default:
                        data = await response.json();
                        alert(data)
                        break;
                }
                console.log(response.status);
            });
    delCookie("predict");
    document.getElementById("summary").innerHTML = "Anonym";
    document.getElementById("profilLink").style.display = "none";
    login = document.getElementById("login");
    login.innerHTML = "<u>Login</u>";
    login.href = "/html/login.html";
}

function mediaDropDown() {
    document.getElementById("dropdown").classList.toggle("show");
}

  