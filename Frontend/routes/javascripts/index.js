const staff = {
    0: "Hermann Müller",
    1: "Koch Chef",
    2: "Cap Cappa"
}

const testImg = {
    0: "./html/img/besitzer.jpg",
    1: "./html/img/koch.jpg",
    2: "./html/img/kellner.jpg"
}

let counter = 0

function loadNews() {
    fetch('<%= api %>/api/news/new', { method: "GET", headers: { 'Content-Type': 'application/json' } })
        .then(async response => {
            if (response.status !== 404) {
                var data = await response.json();
                document.getElementById("news").innerHTML = data.caption;
            }
        });
}

function cycleStaff(dir) {
    counter = (counter + dir) % 3 < 0 ? 2 : (counter + dir) % 3;
    document.getElementById("coworkerName").innerText = staff[counter];
    document.getElementById("coworkerImg").src = testImg[counter];
}

window.onload = loadNews;


