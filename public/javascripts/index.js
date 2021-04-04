function addUnderline(obj) {
    obj.style.textDecoration = "underline";
}

function removeUnderline(obj) {
    obj.style.textDecoration = "";
}

function toggleControl() {
    panel = document.getElementById("controlPanel");
    if (panel.style.display === "none")
        panel.style.display = "block"
    else
        panel.style.display = "none"
}

function displayLogin(name, points) {
    panel = document.getElementById("summary").textContent = name + "\r\nTreuepunkte: " + points;
}
