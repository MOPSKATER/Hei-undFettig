var lastChange = ["",""];
// TODO: get permission level from server / predict cookie
var permission = 10;
var news = []

function load() {
    fetch('/api/news/all', { method: "GET", headers: { 'Content-Type': 'application/json' } })
        .then(async response => {
            if (response.status !== 404) {
                var data = await response.json();
                news = data.news;
                update();
            }
        });
}

function update() {
    news.forEach(function(item) {
        var newItem = document.getElementById("news-item").content.cloneNode(true);
        newItem.querySelector(".header").innerHTML = item[0];
        newItem.querySelector(".text").innerHTML = item[1];
        if (permission >= 10) {
            newItem.querySelector(".admin").removeAttribute("hidden");
        }
        document.getElementById("news-container").appendChild(newItem);
    });
    if (permission >= 10) {
        document.getElementById("new-news").removeAttribute("hidden");
        Array.from(document.getElementsByClassName("news")).forEach(elem => {
            elem.querySelector(".content").style.width = "87%"
        });
    }
}

function add(e) {
    div = e.parentNode.parentNode;
    if (div.querySelector(".header").value !== "") {
        var newItem = document.getElementById("news-item").content.cloneNode(true);
        newItem.querySelector(".header").innerHTML = div.querySelector(".header").value.replaceAll("\n","");
        newItem.querySelector(".text").innerHTML = div.querySelector(".text").value.replaceAll("\n","<br>");
        if (permission >= 10) {
            newItem.querySelector(".admin").removeAttribute("hidden");
            newItem.querySelector(".content").style.width = "87%";
        }
        div.parentNode.insertBefore(newItem,div.nextSibling);
        div.querySelector(".header").value = "";
        div.querySelector(".text").value = "";
    }
    else {
        alert("Zumindest ein Titel muss angegeben werden!");
    }
}
function remove(e) {
    e.parentNode.parentNode.remove();
    // TODO: api remove
}
function edit(e) {
    div = e.parentNode.parentNode;
    lastChange = [div.querySelector(".header").innerHTML, div.querySelector(".text").innerHTML];
    var newItem = document.getElementById("edit-news").content.cloneNode(true);
    newItem.querySelector(".header").value = lastChange[0];
    newItem.querySelector(".text").value = lastChange[1].replaceAll("<br>","\n");
    newItem.querySelector(".content").style.width = "87%";
    div.parentNode.replaceChild(newItem, div);
}
function save(e) {
    div = e.parentNode.parentNode;
    var newItem = document.getElementById("news-item").content.cloneNode(true);
    newItem.querySelector(".header").innerHTML = div.querySelector(".header").value.replaceAll("\n","");
    newItem.querySelector(".text").innerHTML = div.querySelector(".text").value.replaceAll("\n","<br>");
    if (permission >= 10) {
        newItem.querySelector(".admin").removeAttribute("hidden");
        newItem.querySelector(".content").style.width = "87%";
    }
    div.parentNode.replaceChild(newItem, div);
}
function cancel(e) {
    div = e.parentNode.parentNode;
    var newItem = document.getElementById("news-item").content.cloneNode(true);
    newItem.querySelector(".header").innerHTML = lastChange[0];
    newItem.querySelector(".text").innerHTML = lastChange[1];
    if (permission >= 10) {
        newItem.querySelector(".admin").removeAttribute("hidden");
        newItem.querySelector(".content").style.width = "87%";
    }
    div.parentNode.replaceChild(newItem, div);
}

window.onload = load;
