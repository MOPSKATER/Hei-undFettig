function addUnderline(obj) {
    obj.children[0].style.textDecoration = "underline";
}

function removeUnderline(obj) {
    obj.children[0].style.textDecoration = "";
}

function toggleControl() {
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
    login.href = "/html/logout.html";
}
