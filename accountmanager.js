const Privileges = require('./privileges');

const Accountmanager = {

    login(req) {
        if (req.body.password === "deny")
            return
        else {
            return setSession(req)
        }
    },

    isLoggedIn(req) {
        return req.session.accessLevel != Privileges.Guest ? true : false
    },

    register(req) {
        return setSession(req)
    }
};

function setSession(req) {
    req.session.name = "Müller";
    req.session.prename = "Hermann";
    req.session.points = 70;
    req.session.accessLevel = Privileges.Guest;
    return { prename: "Hermann", name: "Müller", points: 70, accessLevel: Privileges.Guest }
}

module.exports = Accountmanager;