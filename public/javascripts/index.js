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

function loadNews() {
    fetch('/api/news/new', { method: "GET", headers: { 'Content-Type': 'application/json' } })
        .then(async response => {
            if (response.status !== 404) {
                var data = await response.json();
                document.getElementById("news").innerHTML = data.title;
            }
        });
}

function cycleStaff(dir) {
    counter = (counter + dir) % 3 < 0 ? 2 : (counter + dir) % 3;
    document.getElementById("coworkerName").innerText = staff[counter];
    document.getElementById("coworkerImg").src = testImg[counter];
}

window.onload = loadNews;


  