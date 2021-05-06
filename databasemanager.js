var sqlite3 = require('sqlite3')
const crypto = require("crypto")
const Privileges = require("./privileges")

const DBSOURCE = "db.sqlite"
const db = new sqlite3.Database("db.sqlite", (err) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
})

const usedIDs = []

db.run("CREATE TABLE IF NOT EXISTS users (uid text, prename text, name text, points integer, street text, number text, place text, plz integer, email text, salt text, password text, permissionlevel integer)", (err) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
    db.all("SELECT uid FROM users", (err, rows) => {
        if (rows)
            rows.forEach(element => {
                usedIDs.push(element.id)
            });
        if (usedIDs.length === 0) {
            newUID = IDGenerator()
            usedIDs.push(newUID)
            pass = IDGenerator()
            salt = IDGenerator()
            hash = crypto.createHash("sha256").update(pass).digest("hex")
            hash = crypto.createHash("sha256").update(salt + hash).digest("hex")
            db.prepare("INSERT INTO users (uid, prename, name, points, street , number , place , plz, email, salt , password , permissionlevel) VALUES (?, null, null, 0, null, null, null, null, ?, ?, ?, ?)").
                run(newUID, "Admin", salt, hash, Privileges.Admin, (err) => {
                    console.log("Admin credentials:\nemail: Admin\npassword: " + pass + "\n\nChange the default password!")
                });
        }
    });
});
db.run("CREATE TABLE IF NOT EXISTS cart (id integer, itemid integer)");
db.run("CREATE TABLE IF NOT EXISTS item (id integer, name text, description text, price decimal)");
db.run("CREATE TABLE IF NOT EXISTS news (id integer, caption text, text text, date date)");
db.run("CREATE TABLE IF NOT EXISTS orders (uid text, id integer, date datetime)");


const Databasemanager = {

    async getUserData(userID, callback) {
        db.prepare("SELECT * FROM users WHERE uid=?").get(userID, (err, table) => {
            callback(err, table)
        });
    },

    register(data, callback) {
        newUID = IDGenerator()
        usedIDs.push(newUID)
        //Check if Email already exists
        db.prepare("SELECT email FROM users WHERE email=?").get(data.email, (err, table) => {
            if (table) {
                callback("Email already exists")
                return
            }
            db.prepare("INSERT INTO users (uid, prename, name, points, street , number , place , plz, email, salt , password , permissionlevel) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)").
                run(newUID, data.prename, data.name, 0, data.street, data.number, data.place, data.plz, data.email, data.salt, data.hash, Privileges.User, (err) => {
                    callback(err, newUID)
                });

        })
    },

    getCredentials(email, callback) {
        db.prepare("SELECT uid, permissionlevel, email, prename, points, salt, password FROM users WHERE email=?").get(email, (err, table) => {
            callback(err, table)
        })
    }

}

function IDGenerator() {
    var result = ""
    const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    for (let i = 0; i < 16; i++)
        result += alphabet[Math.floor(Math.random() * alphabet.length)]
    return result in usedIDs ? IDGenerator() : result
}

module.exports = Databasemanager;