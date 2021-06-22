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
                    callback(undefined, { email: table.email, prename: table.prename, points: table.points, accessLevel: table.permissionlevel, uid: table.uid })
                else
                    callback("Email oder Passwort falsch")
            }
        })
    },

    isLoggedIn(req) {
        return req.session.accessLevel > Privileges.Guest ? true : false
    },

    register(data, callback) {
        this.generateHash(data)
        //Add creds to table
        Database.register(data, callback)
    },

    generateHash(data) {
        //Generate Salt
        if (!data.salt) {
            const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-.,=?<>_!?&%"
            for (let i = 0; i < 16; i++)
                data.salt += alphabet[Math.floor(Math.random() * alphabet.length)]
        }

        //Hash Password
        data.password = crypto.createHash("sha256").update(data.salt + data.password).digest("hex")
    }
};

module.exports = Accountmanager