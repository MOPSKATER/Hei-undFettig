const crypto = require("crypto")
const Privileges = require('./privileges');
const Database = require("./databasemanager")

const Accountmanager = {

    login(req, callback) {
        Database.getCredentials(req.body.email, (err, table) => {
            if (err) {
                callback(err)
            }
            else if (!table) {
                callback("Email oder Passwort falsch")
            }
            else {
                if (crypto.createHash("sha256").update(table.salt + req.body.password).digest("hex") === table.password)
                    callback(undefined, table)
                else
                    callback("Email oder Passwort falsch")
            }
        })
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
    },

    setSession(req, data) {
        req.session.name = data.name;
        req.session.prename = data.prename;
        req.session.points = data.points;
        req.session.accessLevel = data.accessLevel;
    }
};

module.exports = Accountmanager;