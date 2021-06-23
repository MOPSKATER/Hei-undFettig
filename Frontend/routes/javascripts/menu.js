
function load() {
    fetch('<%= api %>/api/item/all/', { method: "GET", headers: { 'Content-Type': 'application/json' }})
        .then(async response => {
            switch (response.status) {
                case 200:
                    var data = await response.json();
                    data = data.sort((a,b)=>{return b.id - a.id})
                    data.forEach(element => {
                        add(element.id.split(".")[0], element)
                    });
                    break;
                default:
                    alert("interner Server Error")
                    break;
            }
        });
}

function addToBasket(elem) {
    fetch('<%= api %>/api/account/isLoggedin', { method: "GET", credentials: "include" })
        .then(async response => {
            var profile = getJSONCookie("predict");
            switch (response.status) {
                case 200:
                    break;
                case 401:
                default:
                    window.location.href = "./login.html";
                    break;
            }
        });
    var div = elem.parentNode.parentNode;
    fetch('<%= api %>/api/cart/add', { method: "POST", body: JSON.stringify({ id: div.querySelector(".num").innerHTML }), headers: { 'Content-Type': 'application/json' }, credentials: "include" })
        .then(async response => {
            switch (response.status) {
                case 200:
                    alert("Menu \"" + div.querySelector(".name").innerHTML + "\" zum Warenkorb hinzugefügt.");
                    break;

                default:
                    //TODO: add proper error handling
                    alert("Menu \"" + div.querySelector(".name").innerHTML + "\" bereits im Warenkorb.");
                    break;
            }
        });
}

function add(course, attr) {
    var newItem = document.getElementsByTagName("template")[0].content.cloneNode(true);
    newItem.querySelector(".num").innerHTML = attr.id;
    newItem.querySelector(".name").innerHTML = attr.name;
    newItem.querySelector(".descr").innerHTML = attr.description;
    newItem.querySelector(".price").innerHTML = attr.price.toFixed(2).replace(".", ",") + "€";
    var courseId = ["starters","mainCourses","desserts","drinks"];
    document.getElementById(courseId[course-1]).parentNode.insertBefore(newItem, document.getElementById(courseId[course-1]).nextSibling);
}

window.onload = load;
