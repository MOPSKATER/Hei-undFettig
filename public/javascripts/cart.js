
// exampledata if cookies don't work (local)
// TODO: change back to empty
var cart = [];
var total = 0;
var paypal = 0;

function load() {
    update();

    var maxTime = 48;
    for (var i = 1; i <= maxTime; i++) {
        var opt = document.createElement("option");
        var m = (i * 15) % 60;
        var h = Math.floor((i * 15) / 60);
        opt.text += ("0" + h).slice(-2) + ":" + ("0" + m).slice(-2);
        document.getElementById("time").add(opt);
    }
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

    paypal = 0;
    if (document.getElementById("paypal").checked) paypal = (total * 0.0249 + 0.35);
    document.getElementById("total_price").innerHTML = "Preis gesammt: " + (total + paypal).toFixed(2).replace(".",",") + "€";
    document.getElementById("cut_mwst").innerHTML = "Anteil MwSt: " + (total * 0.19).toFixed(2).replace(".",",") + "€";
    document.getElementById("cut_paypal").innerHTML = "Paypal Gebühren: " + paypal.toFixed(2).replace(".",",") + "€";
}

function changedCount(e) {
    var index = e.parentNode.parentNode.rowIndex;
    cart[index].count = e.value;
    setJSONCookie("cart", cart);

    update();
}

function changedMethode() {
    document.getElementById("cut_paypal").hidden = !document.getElementById("paypal").checked;

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
    if (cart.length > 0) {
        if (confirm("Bestellung abschicken?")) {
            var time = new Date();
            time.setHours(time.getHours() + parseFloat(document.getElementById("time").value.split(":")[0]));
            time.setMinutes(time.getMinutes() + parseFloat(document.getElementById("time").value.split(":")[1]));

            var height = window.innerHeight;
            let newWin = window.open("./bon.html", "bon", "toolbar=no,menubar=no,location=no,height=" + height + ",width=" + Math.floor(height*(7/10)));
            newWin.onload = function() {
                cart.forEach(function (item) {
                    var newItem = document.getElementsByTagName("template")[0].content.cloneNode(true);
                    newItem.querySelector(".num").innerHTML = item.id;
                    newItem.querySelector(".name").innerHTML = item.name;
                    newItem.querySelector(".price").innerHTML = item.price.toFixed(2).replace(".",",") + "€";
                    newItem.querySelector(".count").innerHTML = "#" + item.count;
                    newItem.querySelector(".remove").remove()
                    newWin.document.getElementById("cartContent").append(newItem);
                });
                newWin.document.getElementById("retrieval").innerHTML = time;
                newWin.document.getElementById("total").innerHTML = (total + paypal).toFixed(2).replace(".",",") + "€";
                newWin.document.getElementById("cut_mwst").innerHTML = "Anteil MwSt: " + (total * 0.19).toFixed(2).replace(".",",") + "€";
                if (document.getElementById("paypal").checked) {
                    newWin.document.getElementById("cut_paypal").innerHTML = "Paypal Gebühren: " + paypal.toFixed(2).replace(".",",") + "€";
                    newWin.document.getElementById("paym_methode").innerHTML = "PayPal";
                }
                if (document.getElementById("notice").value !== "") {
                    newWin.document.getElementById("bon-notice").hidden = false;
                    newWin.document.getElementById("bon-notice").innerHTML += document.getElementById("notice").value.replaceAll("\n","<br>");
                }
                delCookie("cart");
                cart = [];
                update();
                window.location.href = "./order.html"; // = "../index.html"
            }
            // temp until backend is implemented
            var orders = getJSONCookie("orders") || [];
            var newOrder = {
                name: "Peter Pan",
                time: ["Mo","Di","Mi","Do","Fr","Sa","So"][time.getDay()-1] + " - " + time.getHours() + ":" + time.getMinutes(),
                cart: cart,
                notice: document.getElementById("notice").value,
                total: total.toFixed(2),
                paypal: document.getElementById("paypal").checked
            };
            orders.push(newOrder);
            setJSONCookie("orders", orders);
        }
    }
    else {
        alert("Nichts im Warenkorb!");
    }
}

window.onload = load;
