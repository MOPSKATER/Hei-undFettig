
var cart = [];
var total = 0;

function load() {
    document.cookie.split(";").forEach(function(elem) {
        cookie = elem.split("=")
        if(cookie[0].trim() == "cart") {
            cart = JSON.parse(cookie[1]);
            return;
        }
    });
    if (cart.length === 0) {
        document.getElementById("checkout").append("Noch nichts hier! :( Schaue auf der Speisekarte vorbei!");
    }
    else {
        cart.forEach(function(item) {
            var newItem = document.getElementsByTagName("template")[0].content.cloneNode(true);
            newItem.querySelector(".num").innerHTML = item.id;
            newItem.querySelector(".name").innerHTML = item.name;
            newItem.querySelector(".price").innerHTML = item.price + "€";
            newItem.querySelector(".count").value = item.count;
            document.getElementById("checkout").append(newItem);

            total += item.price;
        })
    }

    document.getElementById("total_price").innerHTML = "Preis gesammt: " + total.toFixed(2) + "€";
    document.getElementById("cut_mwst").innerHTML = "Anteil MwSt: " + (total * 0.19).toFixed(2) + "€";
    document.getElementById("cut_paypal").innerHTML = "Paypal Gebühren: " + (total * 0.0249 + 0.35).toFixed(2) + "€";

    var today = new Date();
    document.getElementById("time").value = today.getHours() + ":" + ("00" + today.getMinutes()).slice(-2);
}

function remove(e) {
    var index = e.parentNode.parentNode.rowIndex;
    document.getElementById("checkout").deleteRow(index);
    cart.splice(index, 1);
    document.cookie = "cart=" + JSON.stringify(cart) + "; path=/;";
}

window.onload = load;
