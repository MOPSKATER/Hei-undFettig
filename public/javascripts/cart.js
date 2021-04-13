
var cart = [];
var total = 0;

function load() {
    update();

    var today = new Date();
    document.getElementById("time").value = today.getHours() + ":" + ("00" + (today.getMinutes() + 15) % 60).slice(-2);
}

function update() {
    document.getElementById("cartContent").innerHTML = "";
    total = 0;

    document.cookie.split(";").forEach(function (elem) {
        cookie = elem.split("=")
        if (cookie[0].trim() == "cart") {
            cart = JSON.parse(cookie[1]);
            return;
        }
    });
    if (cart.length === 0) {
        document.getElementById("cartContent").append("Noch nichts hier! :( Schaue auf der Speisekarte vorbei!");
    }
    else {
        cart.forEach(function (item) {
            var newItem = document.getElementsByTagName("template")[0].content.cloneNode(true);
            newItem.querySelector(".num").innerHTML = item.id;
            newItem.querySelector(".name").innerHTML = item.name;
            newItem.querySelector(".price").innerHTML = item.price + "€";
            newItem.querySelector(".count").querySelector("input").value = item.count;
            document.getElementById("cartContent").append(newItem);

            total += item.price * item.count;
        })
    }

    document.getElementById("total_price").innerHTML = "Preis gesammt: " + total.toFixed(2) + "€";
    document.getElementById("cut_mwst").innerHTML = "Anteil MwSt: " + (total * 0.19).toFixed(2) + "€";
    document.getElementById("cut_paypal").innerHTML = "Paypal Gebühren: " + (total * 0.0249 + 0.35).toFixed(2) + "€";
}

function changedCount(e) {
    var index = e.parentNode.parentNode.rowIndex;
    cart[index].count = e.value;
    document.cookie = "cart=" + JSON.stringify(cart) + "; path=/;";

    update();
}

function remove(e) {
    var index = e.parentNode.parentNode.rowIndex;
    document.getElementById("cartContent").deleteRow(index);
    cart.splice(index, 1);
    document.cookie = "cart=" + JSON.stringify(cart) + "; path=/;";

    update();
}

function order() {
    // temp until backend is implemented
    if (confirm("Bestellung abschicken?")) {
        var orders = getJSONCookie("orders") || [];
        var newOrder = {
            name: "Peter Pan",
            time: document.getElementById("time").value,
            cart: cart,
            notice: document.getElementById("notice").value,
        };
        console.log(orders);
        orders.push(newOrder);
        setJSONCookie("orders", orders);
        delCookie("cart");
        alert("Vielen Dank für Ihre Bestellung!\nTemporäre weiterleitung zu \"./order.html\" zu Demonstartionszwecken.")
        window.location.href = "./order.html";
    }
}

window.onload = load;
