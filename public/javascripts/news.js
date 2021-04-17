var lastChange = ["",""];
// TODO: get permission level from server / predict cookie
var permission = 10;

function load() {
    news = [
        [
            "Januar 2021",
            "Liebe Gäste, wir wünschen Ihnen und Ihrer Familie ein gutes und gesundes neues Jahr!"
        ],
        [
            "Weihnachten 2020",
            "Sie suchen für Ihre Lieben noch ein Weihnachtsgeschenk? Bei uns erhalten Sie Gutscheine (Betrag nach Wahl), Schnaps aus unserer historischen Schnapsbrennerei oder selbstgemachte Liköre. Schreiben Sie und eine E-Mail oder rufen Sie uns an."
        ],
        [
            "Dezember 2020",
            "Liebe Gäste, unser Restaurant bleibt bis zum Ende des Lockdown geschlossen.<br>Wir wünschen Ihnen und Ihrer Familie ein schönes Weihnachtsfest und ein gutes, gesundes Jahr 2021.<br>Auf ein baldiges Wiedersehen"
        ],
        [
            "Juli 2020",
            "Liebe Gäste, die Ortsdurchfahrt von ist seit Juli gesperrt.<br>Wir möchten Sie darauf hinweisen, dass die Zufahrt trotzdem ohne Probleme möglich ist. Bitte folgen Sie hier der Umleitungs-Beschilderung. Wir hoffen, dass Sie trotz diesen Umständen den Weg zu uns finden.<br>Sollten Sie jedoch Hilfe benötigen können Sie uns gerne kontaktieren."
        ],
        [
            "Mai 2020",
            "Liebe Gäste, wir öffnen unser Restaurant wieder ab dem 21.5.2020 für Sie!<br>Wir bitten Sie sich bei Ihrem Besuch an die Verhaltensregeln zu halten, die sie natürlich auch den ausgehängten Schildern entnehmen können. Bitte unterstützen Sie uns dabei, allen einen sicheren und schönen Besuch bei uns zu ermöglichen.<br>Es ergeben sich dadurch auch einige Neuerungen:<br><br>Geänderte Öffnungszeiten: wir sind nun Freitag von 15 – 21 Uhr und Samstag und Sonntag durchgehend (11- 21 Uhr) für Sie da. Die Küche ist jeweils durchgehend bis 20 Uhr geöffnet. Wir bitten Sie zu den Hauptgeschäftszeiten (Samstag und Sonntag 12 – 14 Uhr und 17 – 19 Uhr) einen Tisch zu reservieren.<br><br>Angepasste Speisekarte: Wir bieten in diesen Zeiten durchgehend warme Küche an. Unsere aktuelle Speisekarte finden Sie <a href=\"./menu.html\">hier</a>. Neu sind auch unsere Kaffeespezialitäten und selbstgemachten Kuchen.<br><br>Gerne können Sie unsere Gerichte auch abholen und bei Ihnen zu Hause genießen."
        ],
        [
            "Wir freuen uns, Sie sobald wie möglich wieder im Heiß und Fettig begrüßen zu dürfen!",
            ""
        ]
    ]
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
