function addUnderline(obj) {
    obj.children[0].style.textDecoration = "underline";
}

function removeUnderline(obj) {
    obj.children[0].style.textDecoration = "";
}

function toggleControl() {
    var profile = getJSONCookie("predict");
    if (profile && profile.accessLevel > 0) {
        displayLogin(profile.displayName, profile.points);
    }
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
    fetch('/api/account/logout', { method: "POST", headers: { 'Content-Type': 'application/json' }, credentials: "include" })
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
    window.location.href = "/index.html";
}

function mediaDropDown() {
    document.getElementById("dropdown").classList.toggle("show");
}
  
// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("menuContainer");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}
