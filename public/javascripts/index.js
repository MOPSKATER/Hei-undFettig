const staff = {
    0: "Hermann Müller",
    1: "Susi Strolch",
    2: "Cap Cappa"
}

const testImg = {
    0: "https://static.toiimg.com/photo/73244344.cms",
    1: "https://image.gala.de/21207136/t/D5/v16/w1440/r1.5/-/susi-erdmann--11474305-.jpg",
    2: "https://www.tipps-vom-experten.de/uploads/2018/04/mann-schoen-gesicht-lacht-fotolia-viacheslav-iakobchuk-700xpl.jpg"
}

let counter = 0

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
    login = document.getElementById("login");
    login.innerHTML = "<u>Logout</u>";
    login.href = "/html/logout.html";
}

function cycleStaff(dir) {
    counter = (counter + dir) % 3 < 0 ? 2 : (counter + dir) % 3;
    document.getElementById("coworkerName").innerText = staff[counter];
    document.getElementById("coworkerImg").src = testImg[counter];
}
