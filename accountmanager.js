const Privileges = require('./privileges');

const Accountmanager = {

    login(req) {
        if (req.body.password === "deny")
            return
        else {
            req.session.name = "Müller";
            req.session.prename = "Hermann";
            req.session.points = 70;
            req.session.accessLevel = Privileges.Guest;
            return { prename: "Hermann", name: "Müller", points: 70, accessLevel: Privileges.Guest }
        }
    }
};

module.exports = Accountmanager;