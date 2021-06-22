
function load() {
    menu = [
        [
            "starters",
            [
                ["Salat", "Diese Beschreibung ist sehr lang und sagt nichts über das Essen aus.", 19.01],
                ["Suppe", "Suppe mit Schnittlauch", 29.00]
            ]
        ],
        [
            "mainCourses",
            [
                ["Steak", "Steak mit Pommes und Salat", 19.02],
                ["Schnitzel", "Schnitzel mit Pommes und Salat", 29.02],
                ["Schnitzel x2", "Das obendrüber. Nur mehr.", 39.02]
            ]
        ],
        [
            "desserts",
            [
                ["Salz", "Salz-Lecksteine (nur für Kühe!)", 19.03]
            ]
        ]
    ]

    var prev = 0;
    for (var i = 0; i < menu.length; i++) {
        var current = 0
        for (var j = menu[i][1].length - 1; j >= 0; j--) {
            add(menu[i][0], prev + j, menu[i][1][j]);
            current += 1;
        }
        prev += current;
    }
}

function addToBasket(elem) {
    fetch('<%= api %>/api/account/isLoggedin', { method: "GET", credentials: "include" })
        .then(async response => {
            var profile = getJSONCookie("predict");
            switch (response.status) {
                case 200:
                    break;
                case 401:
                default:
                    window.location.href = "./login.html";
                    break;
            }
        });
    var div = elem.parentNode.parentNode;
    fetch('<%= api %>/api/cart/add', { method: "POST", body: JSON.stringify({ id: parseInt(div.querySelector(".num").innerHTML) }), headers: { 'Content-Type': 'application/json' }, credentials: "include" })
        .then(async response => {
            switch (response.status) {
                case 200:
                    alert("Menu \"" + div.querySelector(".name").innerHTML + "\" zum Warenkorb hinzugefügt.");
                    break;

                default:
                    //TODO: add proper error handling
                    alert("Menu \"" + div.querySelector(".name").innerHTML + "\" bereits im Warenkorb.");
                    break;
            }
        });
}

function add(course, num, attr) {
    var newItem = document.getElementsByTagName("template")[0].content.cloneNode(true);
    newItem.querySelector(".num").innerHTML = num;
    newItem.querySelector(".name").innerHTML = attr[0];
    newItem.querySelector(".descr").innerHTML = attr[1];
    newItem.querySelector(".price").innerHTML = attr[2].toFixed(2).replace(".", ",") + "€";
    document.getElementById(course).parentNode.insertBefore(newItem, document.getElementById(course).nextSibling);
}

window.onload = load;
