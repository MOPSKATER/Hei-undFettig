const crypto = require("crypto")
const Privileges = require('./privileges');
const Database = require("./databasemanager")

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

    async register(data, callback) {
        //Generate Salt
        if (!data.salt) {
            const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-.,=?<>_!?&%"
            for (let i = 0; i < 16; i++)
                data.salt += alphabet[Math.floor(Math.random() * alphabet.length)]
        }

        //Hash Password
        data.hash = crypto.createHash("sha256").update(data.salt + data.hash).digest("hex")

        //Add creds to table
        Database.register(data, callback)
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