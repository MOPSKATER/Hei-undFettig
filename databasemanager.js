var sqlite3 = require('sqlite3')
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
    db.all("SELECT id FROM users", (err, rows) => {
        if (rows)
            rows.forEach(element => {
                usedIDs.push(element.id)
            });
    });
});
db.run("CREATE TABLE IF NOT EXISTS cart (id integer, itemid integer, ordered integer)");
db.run("CREATE TABLE IF NOT EXISTS item (name text, description text, price decimal)");
db.run("CREATE TABLE IF NOT EXISTS news (caption text, text text, date date)");


const Databasemanager = {

    async getUserData(userID, callback) {
        db.prepare("SELECT * FROM users WHERE uid=?").get(userID, (err, table) => {
            callback(err, table)
        });
    },

    register(data, callback) {
        db.prepare("INSERT INTO users (uid, prename, name, points, street , number , place , plz, email, salt , password , permissionlevel) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)").
            run(IDGenerator(), data.prename, data.name, 0, data.street, data.number, data.place, data.plz, data.email, data.salt, data.hash, Privileges.Guest, (err) => {
                callback(err)
            });
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