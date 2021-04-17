
var cart = [];

function load() {
    menu = [
        [
            "starters",
            [
                ["Salat", "Diese Beschreibung ist sehr lang und sagt nichts über das Essen aus.", 19.01],
                ["Suppe", "Suppe mit Schittlauch", 29.00]
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
    // TODO: Preise nicht aus dem HTML-element lesen
    cart = getJSONCookie("cart") || cart;
    var newItem = { id: undefined, name: undefined, price: undefined, count: 1 }
    elem.parentNode.parentNode.childNodes.forEach(function(x) {
        if (x.className == "num") newItem.id = parseFloat(x.innerHTML);
        if (x.className == "name") newItem.name = x.innerHTML;
        if (x.className == "price") newItem.price = parseFloat(x.innerHTML);
    });
    if (cart.findIndex(function(item) {
        if (item.id === newItem.id) {
            return true;
        }
    }) === -1) {
        cart.push(newItem);
        setJSONCookie("cart", cart);
        alert("Menu \"" + newItem.name + "\" zum Warenkorb hinzugefügt.");
    }
    else {
        alert("Menu \"" + newItem.name + "\" bereits im Warenkorb.\nDie Anzahl kann an der Kasse ge\u00e4ndert werden.");
    }
}

function add(course, num, attr) {
    var newItem = document.getElementsByTagName("template")[0].content.cloneNode(true);
    newItem.querySelector(".num").innerHTML = num;
    newItem.querySelector(".name").innerHTML = attr[0];
    newItem.querySelector(".descr").innerHTML = attr[1];
    newItem.querySelector(".price").innerHTML = attr[2].toFixed(2).replace(".",",") + "€";
    document.getElementById(course).parentNode.insertBefore(newItem,document.getElementById(course).nextSibling);
}

window.onload = load;
