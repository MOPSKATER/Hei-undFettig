var lastChange = ["", ""];
var lastId = 0;
// TODO: get permission level from server / predict cookie
var permission = 0;
var news = []
var highestId = 0;
var editing = false;

function load() {
    update();
}

function update() {
    editing = false;
    Array.from(document.getElementsByClassName("news")).forEach(elem => {
        if (elem.id != "new-news") elem.remove();
    });
    var predict = getJSONCookie("predict");
    predict ? permission = predict.accessLevel : permission = 0
    fetch('<%= api %>/api/account/isLoggedin', { method: "GET", credentials: "include" })
        .then(async response => {
            switch (response.status) {
                case 200:
                    break;
                case 401:
                default:
                    permission = 0;
                    break;
            }
            fetch('<%= api %>/api/news/all', { method: "GET", headers: { 'Content-Type': 'application/json' } })
                .then(async response => {
                    if (response.status === 200) {
                        var data = await response.json();
                        data.forEach(function (item) {
                            var newItem = document.getElementById("news-item").content.cloneNode(true);
                            newItem.querySelector(".header").innerHTML = item.caption;
                            newItem.querySelector(".text").innerHTML = item.text.replaceAll("\n", "<br/>");
                            if (highestId <= item.id) highestId = item.id;
                            if (permission >= 10) newItem.querySelector(".admin").removeAttribute("hidden");
                            document.getElementById("news-container").insertBefore(newItem, document.getElementById("news-container").children[0].nextSibling);
                            document.getElementById("news-container").children[1].setAttribute("newsId", item.id);
                        });
                    }
                    if (permission >= 10) {
                        document.getElementById("new-news").removeAttribute("hidden");
                        Array.from(document.getElementsByClassName("news")).forEach(elem => {
                            elem.querySelector(".content").style.width = "87%"
                        });
                    }
                    //TODO: add error handling
                });
        });
}

function add(e) {
    div = e.parentNode.parentNode;
    if (div.querySelector(".header").value !== "") {
        fetch('<%= api %>/api/news/add', { method: "POST", body: JSON.stringify({ id: highestId + 1, caption: document.getElementById("new-news").querySelector(".header").value, text: document.getElementById("new-news").querySelector(".text").value }), headers: { 'Content-Type': 'application/json' } })
            .then(async response => {
                switch (response.status) {
                    case 200:
                        update();
                        document.getElementById("new-news").querySelector(".header").value = "";
                        document.getElementById("new-news").querySelector(".text").value = "";
                        break;

                    default:
                        //TODO: add proper error handling
                        alert("failed")
                        break;
                }
            });
    }
    else {
        alert("Zumindest ein Titel muss angegeben werden!");
    }
}
function remove(e) {
    fetch('<%= api %>/api/news/delete', { method: "DELETE", body: JSON.stringify({ id: e.parentNode.parentNode.getAttribute("newsId") }), headers: { 'Content-Type': 'application/json' } })
        .then(async response => {
            switch (response.status) {
                case 200:
                    update();
                    break;

                default:
                    //TODO: add proper error handling
                    alert("failed")
                    break;
            }
        });
}
function edit(e) {
    if (!editing) {
        editing = true;
        div = e.parentNode.parentNode;
        lastId = e.parentNode.parentNode.getAttribute("newsId");
        lastChange = [div.querySelector(".header").innerHTML, div.querySelector(".text").innerHTML];
        var newItem = document.getElementById("edit-news").content.cloneNode(true);
        newItem.querySelector(".header").value = lastChange[0];
        newItem.querySelector(".text").value = lastChange[1].replaceAll("<br>", "\n");
        newItem.querySelector(".content").style.width = "87%";
        div.parentNode.replaceChild(newItem, div);
    }
}
function save(e) {
    div = e.parentNode.parentNode;
    if (div.querySelector(".header").value !== "") {
        fetch('<%= api %>/api/news/edit', { method: "DELETE", body: JSON.stringify({ id: lastId, caption: div.querySelector(".header").value.replaceAll("\n", ""), text: div.querySelector(".text").value }), headers: { 'Content-Type': 'application/json' } })
            .then(async response => {
                switch (response.status) {
                    case 200:
                        update();
                        break;

                    default:
                        //TODO: add proper error handling
                        alert("failed")
                        break;
                }
            });
    }
    else {
        alert("Zumindest ein Titel muss angegeben werden!");
    }
}
function cancel(e) {
    update();
}

window.onload = load;

