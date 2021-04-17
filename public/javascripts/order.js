
// exampledata if cookies don't work (local)
// TODO: change back to empty
var orders = JSON.parse('[{"name":"Peter Parker","time":"16:55","cart":[{"id":1.1,"name":"Salat","price":19.01,"count":"1"},{"id":1.2,"name":"Suppe","price":29.01,"count":"2"}],"notice":"","total":"77.03","paypal":true},{"name":"Peter Pan","time":"09:43","cart":[{"id":2.1,"name":"Steak","price":19.02,"count":1},{"id":2.3,"name":"Schnitzel x2","price":39.02,"count":"2"},{"id":3.1,"name":"Salz","price":19.03,"count":3}],"notice":"Danke! <3","total":"154.15","paypal":true},{"name":"Tony Stark","time":"19:49","cart":[{"id":1.1,"name":"Salat","price":19.01,"count":1},{"id":1.2,"name":"Suppe","price":29.01,"count":1},{"id":2.1,"name":"Steak","price":19.02,"count":1},{"id":2.2,"name":"Schnitzel","price":29.02,"count":1},{"id":2.3,"name":"Schnitzel x2","price":39.02,"count":1},{"id":3.1,"name":"Salz","price":19.03,"count":1}],"notice":"","total":"154.00","paypal":true}]') // = [];

function load() {
    orders = getJSONCookie("orders") || orders;
    if (orders.length === 0) {
        document.getElementById("orderContainer").append("Alles erledigt! :)");
    }
    else {
        orders.forEach(function (item) {
            var newItem = document.getElementById("order").content.cloneNode(true);
            newItem.querySelector(".headline").innerHTML += item.time;
            newItem.querySelector(".name").innerHTML += item.name;
            newItem.querySelector(".name").href = "./profile.html?id=10";
            newItem.querySelector(".price").innerHTML = String(parseFloat(item.total).toFixed(2)).replace(".",",") + "€";
            if (item.paypal) {
                newItem.querySelector(".price").innerHTML += " (bezahlt: PayPal)"
            }
            item.cart.forEach(function (cartItem) {
                var newItemContent = document.getElementById("orderContent").content.cloneNode(true);
                newItemContent.querySelector(".content").innerHTML += cartItem.id + " " + cartItem.name + " <i>x" + cartItem.count + "</i>";
                newItem.querySelector(".orderContent").append(newItemContent);
            });
            if (item.notice !== "") {
                newItem.querySelector(".noticeblock").innerHTML = item.notice;
                newItem.querySelector(".noticeblock").removeAttribute("hidden");
            }
            document.getElementById("orderContainer").append(newItem);
        })
    }
}

function remove(e) {
    orders.splice(Array.prototype.indexOf.call(e.parentNode.parentNode.children, e.parentNode), 1);
    setJSONCookie("orders", orders);
    e.parentNode.parentNode.removeChild(e.parentNode);
    if (orders.length === 0) {
        document.getElementById("orderContainer").append("Alles erledigt! :)");
    }
}

window.onload = load;
