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

db.run("CREATE TABLE IF NOT EXISTS news (id integer, caption text, text text, date text)", (err) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
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
                var date = new Date(Date.now()),
                    month = "0" + (date.getMonth() + 1),
                    day = "0" + date.getDate(),
                    year = date.getFullYear();
                date = [year, month.slice(-2), day.slice(-2)].join("-")

                db.prepare("INSERT INTO news (id, caption, text, date) VALUES (?, ?, ?, ?)").run(1, "Willkommen im Restaurant Heiß und Fettig", "", date)
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
});
db.run("CREATE TABLE IF NOT EXISTS cart (uid integer, itemid text, amount integer)");
db.run("CREATE TABLE IF NOT EXISTS item (id text PRIMARY KEY, name text, description text, price decimal)", (err) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
    const fs = require('fs')
    fs.readFile(__dirname + "/menu.json", 'utf8', (err, items) => {
        if (err) {
            console.error(err)
            return
        }

        JSON.parse(items).forEach(item => {
            db.prepare("REPLACE INTO item (id, name, price, description) VALUES (?, ?, ?, ?)").run(item.id, item.name, item.price, item.description, (err) => {
                if (err) {
                    console.error(err)
                    return
                }
            })
        })
    })

});
db.run("CREATE TABLE IF NOT EXISTS orders (uid text, itemid text, amount integer, datetime datetime)");

const validKeys = ["prename", "name", "street", "number", "place", "plz", "email", "password"]


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
                run(newUID, data.prename, data.name, 0, data.street, data.number, data.place, data.plz, data.email, data.salt, data.password, Privileges.User, (err) => {
                    callback(err, newUID)
                });

        })
    },

    getCredentials(email, callback) {
        db.prepare("SELECT uid, permissionlevel, email, prename, points, salt, password FROM users WHERE email=?").get(email, (err, table) => {
            callback(err, table)
        })
    },

    setData(data, callback) {
        for (key in Object.keys(data))
            if (!key in validKeys) {
                callback("Invalid key: " + key)
                return
            }

        statement = Object.keys(data)
        for (i = 0; i < statement.length; i++)
            statement[i] = statement[i] + "=\"" + data[statement[i]] + "\""
        db.prepare("UPDATE users SET " + statement.join(", ") + " WHERE uid=?").run(data.uid, (err) => {
            callback(err)
        })
    },

    deleteUser(uid, callback) {
        db.prepare("DELETE FROM users WHERE uid=?").run(uid, (err) => {
            callback(err)
        })
    },

    getNews(callback) {
        db.prepare("SELECT * FROM news").all((err, table) => {
            callback(err, table)
        })
    },

    addNews(data, callback) {
        db.prepare("INSERT INTO news (id, caption, text, date) VALUES (?, ?, ?, ?)").run(data.id, data.caption, data.text, data.date, (err) => {
            callback(err)
        })
    },

    editNews(data, callback) {
        db.prepare("UPDATE news SET caption=?, text=?, date=? WHERE id=?").run(data.caption, data.text, data.date, data.id, (err) => {
            callback(err)
        })
    },

    deleteNews(id, callback) {
        db.prepare("DELETE FROM news WHERE id=?").run(id, (err) => {
            callback(err)
        })
    },

    addCart(uid, id, callback) {
        db.prepare("SELECT itemid, amount FROM cart WHERE uid=? AND itemid=?").get(uid, id, (err, row) => {
            if (err)
                callback(err)
            else {
                if (!row)
                    db.prepare("INSERT INTO cart (uid, itemid, amount) VALUES (?, ?, 1)").run(uid, id, (err) => {
                        callback(err)
                    })
                else
                    callback("item already exists in cart")
            }
        })
    },

    updateCountCart(uid, id, count, callback) {
        if (count <= 0) {
            db.prepare("DELETE FROM cart WHERE uid=? AND itemid=?").run(uid, id, (err) => {
                callback(err)
            })
        }
        else {
            db.prepare("UPDATE cart SET amount=? WHERE uid=? AND itemid=?").run(count, uid, id, (err) => {
                callback(err)
            })
        }
    },

    getCart(uid, callback) {
        db.prepare("SELECT itemid, amount FROM cart WHERE uid=?").all(uid, (err, table) => {
            callback(err, table)
        })
    },

    orderCart(uid, datetime, callback) {
        db.prepare("SELECT itemid, amount FROM cart WHERE uid=?").all(uid, (err, rows) => {
            if (err) {
                callback(err)
                return
            }

            if (!rows.length) {
                callback("Nothing to order")
                return
            }



            rows.forEach(row => {
                db.prepare("INSERT INTO orders (uid, itemid, amount, datetime) VALUES (?, ?, ?, ?)").run(uid, row.itemid, row.amount, datetime, (err) => {
                    db.prepare("DELETE from cart WHERE uid=?").run(uid)
                })
            });
            callback(err)
        })
    },

    getOrders(callback) {
        db.prepare("SELECT * FROM orders").all((err, table) => {
            callback(err, table)
        })
    },

    deleteOrder(uid, datetime, callback) {
        db.prepare("DELETE FROM orders WHERE uid=? AND datetime=?").run(uid, datetime, (err) => {
            callback(err)
        })
    },

    getItem(itemid, callback) {
        db.prepare("SELECT * FROM item WHERE id=?").all(itemid, (err, table) => {
            callback(err, table)
        })
    },

    getAllItems(callback) {
        db.prepare("SELECT * FROM item").all((err, table) => {
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
const Accountmanager = require('./accountmanager')
