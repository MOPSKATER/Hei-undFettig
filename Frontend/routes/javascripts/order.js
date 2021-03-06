
// exampledata if cookies don't work (local)
// TODO: change back to empty

function load() {
    fetch('<%= api %>/api/account/isLoggedin', { method: "GET", credentials: "include" })
        .then(async response => {
            var profile = getJSONCookie("predict");
            switch (response.status) {
                case 200:
                    break;
                case 401:
                default:
                    window.location.href = "./login.html?source=html/order.html";
                    break;
            }
        });
    document.getElementById("orderContainer").innerHTML = "";
    fetch('<%= api %>/api/orders/get', { method: "GET", headers: { 'Content-Type': 'application/json' }, credentials: "include" })
        .then(async response => {
            //TODO: add error handling
            orders = await response.json();
            if (orders.length === 0) {
                document.getElementById("orderContainer").append("Alles erledigt! :)");
            }
            else {
                var fetches = [];
                var orderGroups = {};
                orders.forEach(function (item) {
                    fetches.push(fetch('<%= api %>/api/user/' + item.uid, { method: "GET", headers: { 'Content-Type': 'application/json' }, credentials: "include" })
                        .then(async response => {
                            //TODO: add error handling
                            var user = await response.json();
                            var key = item.uid + item.datetime;
                            if (orderGroups[key] === undefined) {
                                var newItem = {}
                                newItem.datetime = item.datetime;
                                newItem.name = user.prename && user.name ? user.prename + " " + user.name : user.email;
                                newItem.uid = item.uid;
                                orderGroups[key] = {}
                                orderGroups[key].general = newItem;
                                orderGroups[key].items = [];
                            }
                            await fetch('<%= api %>/api/item/get', { method: "POST", body: JSON.stringify({ id: item.itemid }), headers: { 'Content-Type': 'application/json' }, credentials: "include" })
                                .then(async response => {
                                    var content = (await response.json())[0];
                                    var newItemContent = content.id + " " + content.name + " <i>x" + item.amount + "</i> " + content.price.toFixed(2) + "???";
                                    orderGroups[key].items.push(newItemContent);
                                });
                        }));
                })
                Promise.all(fetches).then(function () {
                    Object.keys(orderGroups).forEach(key => {
                        var x = document.getElementById("order").content.cloneNode(true);
                        x.querySelector(".headline").innerHTML += orderGroups[key].general.datetime;
                        x.querySelector(".name").innerHTML += orderGroups[key].general.name;
                        x.querySelector(".name").href = "./profile.html?uid=" + orderGroups[key].general.uid;
                        orderGroups[key].items.forEach(content => {
                            var newItemContent = document.getElementById("orderContent").content.cloneNode(true);
                            newItemContent.querySelector(".content").innerHTML += content;
                            x.querySelector(".orderContent").append(newItemContent);
                        });
                        document.getElementById("orderContainer").append(x);
                        var el = document.getElementById("orderContainer").children;
                        el[el.length - 2].setAttribute("uid", orderGroups[key].general.uid);
                        el[el.length - 2].setAttribute("datetime", orderGroups[key].general.datetime);
                    });
                })
            }
        });
}

function remove(e) {
    fetch('<%= api %>/api/orders/delete', { method: "DELETE", body: JSON.stringify({ uid: e.parentNode.getAttribute("uid"), datetime: e.parentNode.getAttribute("datetime") }), headers: { 'Content-Type': 'application/json' }, credentials: "include" })
        .then(async response => {
            switch (response.status) {
                case 200:
                    break;
                default:
                    //TODO: add proper error handling
                    alert("failed")
                    break;
            }
            load()
        });
}

window.onload = load;

