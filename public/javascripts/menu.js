function load() {
    menu = [
        [
            "starters",
            [
                ["Salat", "Diese Beschreibung ist sehr lang und sagt nichts über das Essen aus.", 19.01],
                ["Suppe", "Suppe mit Schittlauch", 29.01]
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

    for (var i=0; i < menu.length; i++) {
        for (var j=menu[i][1].length - 1; j >= 0 ; j--) {
            add(menu[i][0], (i+1)+"."+(j+1) , menu[i][1][j]);
        }
    }
}

function addToBasket(elem) {
    var id;
    var menu = "";
    elem.parentNode.parentNode.childNodes.forEach(function(item) {
        if (item.className == "num") {
            id = parseFloat(item.innerHTML);
            menu += id + " / ";
        }
        if (item.className == "name") {
            menu += item.innerHTML;
        }
    });
    alert("Menu \"" + menu + "\" zum Warenkorb hinzugefügt.");
}

function add(course, num, attr) {
    var newItem = document.getElementsByTagName("template")[0].content.cloneNode(true);
    newItem.querySelector(".num").innerHTML = num;
    newItem.querySelector(".name").innerHTML = attr[0];
    newItem.querySelector(".descr").innerHTML = attr[1];
    newItem.querySelector(".price").innerHTML = attr[2] + "€";
    document.getElementById(course).parentNode.insertBefore(newItem,document.getElementById(course).nextSibling);
}

window.onload = load;
