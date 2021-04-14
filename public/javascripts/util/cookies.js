
function setJSONCookie(name, content) {
    document.cookie = name + "=" + JSON.stringify(content) + "; path=/;";
}

function getJSONCookie(name) {
    var result = undefined;
    document.cookie.split(";").forEach(function (elem) {
        cookie = elem.split("=")
        if (cookie[0].trim() == name) {
            result = (JSON.parse(cookie[1]));
            return;
        }
    });
    return result;
}

function delCookie(name) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}
