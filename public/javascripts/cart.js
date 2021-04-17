
// exampledata if cookies don't work (local)
// TODO: change back to empty
var cart = JSON.parse('[{"id":1.1,"name":"Salat","price":19.01,"count":4},{"id":1.2,"name":"Suppe","price":29.01,"count":1},{"id":2.1,"name":"Steak","price":19.02,"count":1},{"id":2.3,"name":"Schnitzel x2","price":39.00,"count":1},{"id":3.1,"name":"Salz","price":19.03,"count":3}]') // = [];
var total = 0;

function load() {
    update();

    var today = new Date();
    document.getElementById("time").value = ("0" + ((today.getHours() + Math.min(Math.round((today.getMinutes() + 15) / 60), 1))) % 24).slice(-2) + ":" + ("0" + (today.getMinutes() + 15) % 60).slice(-2);
}

function update() {
    document.getElementById("cartContent").innerHTML = "";
    total = 0;

    cart = getJSONCookie("cart") || cart;
    if (cart.length === 0) {
        document.getElementById("cartContent").append("Noch nichts hier! :( Schaue auf der Speisekarte vorbei!");
    }
    else {
        cart.forEach(function (item) {
            var newItem = document.getElementsByTagName("template")[0].content.cloneNode(true);
            newItem.querySelector(".num").innerHTML = item.id;
            newItem.querySelector(".name").innerHTML = item.name;
            newItem.querySelector(".price").innerHTML = item.price.toFixed(2).replace(".",",") + "€";
            newItem.querySelector(".count").querySelector("input").value = item.count;
            document.getElementById("cartContent").append(newItem);

            total += item.price * item.count;
        })
    }

    document.getElementById("total_price").innerHTML = "Preis gesammt: " + total.toFixed(2).replace(".",",") + "€";
    document.getElementById("cut_mwst").innerHTML = "Anteil MwSt: " + (total * 0.19).toFixed(2).replace(".",",") + "€";
    document.getElementById("cut_paypal").innerHTML = "Paypal Gebühren: " + (total * 0.0249 + 0.35).toFixed(2).replace(".",",") + "€";
}

function changedCount(e) {
    var index = e.parentNode.parentNode.rowIndex;
    cart[index].count = e.value;
    setJSONCookie("cart", cart);

    update();
}

function remove(e) {
    var index = e.parentNode.parentNode.rowIndex;
    document.getElementById("cartContent").deleteRow(index);
    cart.splice(index, 1);
    setJSONCookie("cart", cart);

    update();
}

function order() {
    // temp until backend is implemented
    if (cart.length > 0) {
        if (confirm("Bestellung abschicken?")) {
            var orders = getJSONCookie("orders") || [];
            var newOrder = {
                name: "Peter Pan",
                time: document.getElementById("time").value,
                cart: cart,
                notice: document.getElementById("notice").value,
                total: total.toFixed(2),
                paypal: document.getElementById("paypal").checked
            };
            orders.push(newOrder);
            setJSONCookie("orders", orders);
            delCookie("cart");
            alert("Vielen Dank für Ihre Bestellung!\nTemporäre weiterleitung zu \"./order.html\" zu Demonstartionszwecken.")
            window.location.href = "./order.html";
        }
    }
    else {
        alert("Nichts im Warenkorb!");
    }
}

window.onload = load;
