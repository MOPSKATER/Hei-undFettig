
var orders = [];

function load() {
    orders = getJSONCookie("orders") || [];
    if (orders.length === 0) {
        document.getElementById("orderContainer").append("Alles erledigt! :)");
    }
    else {
        orders.forEach(function (item) {
            var newItem = document.getElementById("order").content.cloneNode(true);
            newItem.querySelector(".headline").innerHTML += item.time;
            newItem.querySelector(".name").innerHTML += item.name;
            newItem.querySelector(".name").href = "./profile.html?id=10";
            newItem.querySelector(".price").innerHTML = item.total + "€";
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
