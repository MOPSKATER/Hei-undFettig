
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
    cart = []
    total = 0;

    fetch('http://<%= api %>/api/cart/get', { method: "GET", headers: { 'Content-Type': 'application/json' }, credentials: "include" })
        .then(async response => {
            if (response.status === 200) {
                var data = await response.json();
                var fetches = [];
                data.forEach(function(item) {
                    console.log(item.itemid)
                    fetches.push(fetch('http://<%= api %>/api/item/get', { method: "POST", body: JSON.stringify({ id: item.itemid }), headers: { 'Content-Type': 'application/json' }, credentials: "include" })
                        .then(async response => {
                            var data = await response.json();
                            if (response.status === 200) {
                                console.log(data)
                                data[0].count = item.amount;
                                cart.push(data[0]);
                            }
                        }))
                    // TODO: add error handling
                })
                Promise.all(fetches).then(function() {
                    if (cart.length === 0) {
                        document.getElementById("cartContent").append("Noch nichts hier! :( Schaue auf der Speisekarte vorbei!");
                    }
                    else {
                        cart.sort((a, b) => (a.id > b.id) ? 1 : -1)
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
                });      
            }
            //TODO: add error handling
        });
}

function changedCount(e) {
    var div = e.parentNode.parentNode;
    var id = div.querySelector(".num").innerHTML;
    fetch('http://<%= api %>/api/cart/updateCount', { method: "POST", body: JSON.stringify({ id: id, count: div.querySelector(".count").querySelector("input").value }), headers: { 'Content-Type': 'application/json' }, credentials: "include" })
        .then(async response => {
            //TODO: add error handling

            update();
        });
}

function changedMethode() {
    document.getElementById("cut_paypal").hidden = !document.getElementById("paypal").checked;

    update();
}

function remove(e) {
    var div = e.parentNode.parentNode;
    var id = div.querySelector(".num").innerHTML;
    fetch('http://<%= api %>/api/cart/remove', { method: "POST", body: JSON.stringify({ id: id }), headers: { 'Content-Type': 'application/json' }, credentials: "include" })
        .then(async response => {
            //TODO: add error handling

            update();
        });
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
            // setJSONCookie("orders", orders);
            var orderDatetime = time.getFullYear() + ":" + ("0" + time.getMonth()).slice(-2) + ":" + ("0" + time.getDate()).slice(-2) + " " + ("0" + time.getHours()).slice(-2) + ":" + ("0" + time.getMinutes()).slice(-2) + ":" + ("0" + time.getSeconds()).slice(-2);
            fetch('http://<%= api %>/api/cart/order', { method: "POST", body: JSON.stringify({ datetime: orderDatetime }), headers: { 'Content-Type': 'application/json' }, credentials: "include" });
        }
    }
    else {
        alert("Nichts im Warenkorb!");
    }
}

window.onload = load;
