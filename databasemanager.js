var sqlite3 = require('sqlite3')
const crypto = require("crypto")
const Privileges = require("./privileges")
const Accountmanager = require('./accountmanager')

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
db.run("CREATE TABLE IF NOT EXISTS cart (uid integer, itemid integer, amount integer)");
db.run("CREATE TABLE IF NOT EXISTS item (id integer, name text, description text, price decimal)");
db.run("CREATE TABLE IF NOT EXISTS news (id integer, caption text, text text, date date)");
db.run("CREATE TABLE IF NOT EXISTS orders (uid text, itemid integer, amount integer, date datetime)");

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
                run(newUID, data.prename, data.name, 0, data.street, data.number, data.place, data.plz, data.email, data.salt, data.hash, Privileges.User, (err) => {
                    callback(err, newUID)
                });

        })
    },

    getCredentials(email, callback) {
        db.prepare("SELECT uid, permissionlevel, email, prename, points, salt, password FROM users WHERE email=?").get(email, (err, table) => {
            callback(err, table)
        })
    },

    setData(uid, data, callback) {
        for (key in Object.keys(data))
            if (!key in validKeys) {
                callback("Invalid key: " + key)
                return
            }

        if (data.password)
            Accountmanager.generateHash(data)

        statement = Object.keys(data)
        for (i = 0; i < statement.length; i++)
            statement[i] = statement[i] + "=\"" + data[statement[i]] + "\""
        db.prepare("UPDATE users SET " + statement.join(", ") + " WHERE uid=?").run(uid, (err) => {
            callback(err)
        })
    },

    deleteUser(uid, callback) {
        db.prepare("DELETE FROM users WHERE uid=?").run(uid, (err) => {
            callback(err)
        })
    },

    getNews(callback) {
        return db.prepare("SELECT * FROM news").all((err, table) => {
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

    async orderCart(uid, datetime, callback) {
        db.prepare("SELECT itemid, amount FROM cart WHERE uid=?").all((err, rows) => {
            if (err) {
                callback(err)
                return
            }

            if (!rows.length) {
                callback("Nothing to order")
            }

            rows.array.forEach(element => {
                db.prepare("INSERT INTO orders (uid, itemid, amount, datetime) VALUES (?, ?, ?, ?)").run(uid, row.itemid, row.amount, datetime, (err) => {
                    db.prepare("DELETE from cart WHERE uid=?").run(uid)
                })
            });
            callback(err)
        })
    },

    getOrders(callback) {
        db.prepare("SELECT * FROM orders").all((err) => {
            callback(err)
        })
    },

    deleteOrder(uid, datetime, callback) {
        db.prepare("DELETE FROM orders WHERE uid=? AND datetime=?").run(uid, datetime, (err) => {
            callback(err)
        })
    },

    getItem(itemid, callback) {
        db.prepare("SELECT * FROM item WHERE id=?").all(itemid, (err, table) => {
            console.log(table,itemid)
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

/*news = [
    [
        "Januar 2021: Frohes Neues!",
        "Liebe Gäste, wir wünschen Ihnen und Ihrer Familie ein gutes und gesundes neues Jahr!"
    ],
    [
        "Weihnachten 2020: Frohe Weihnachten!",
        "Sie suchen für Ihre Lieben noch ein Weihnachtsgeschenk? Bei uns erhalten Sie Gutscheine (Betrag nach Wahl), Schnaps aus unserer historischen Schnapsbrennerei oder selbstgemachte Liköre. Schreiben Sie und eine E-Mail oder rufen Sie uns an."
    ],
    [
        "Dezember 2020: Schließung",
        "Liebe Gäste, unser Restaurant bleibt bis zum Ende des Lockdown geschlossen.<br>Wir wünschen Ihnen und Ihrer Familie ein schönes Weihnachtsfest und ein gutes, gesundes Jahr 2021.<br>Auf ein baldiges Wiedersehen"
    ],
    [
        "Juli 2020: Sperrung Ortsduchfahrt",
        "Liebe Gäste, die Ortsdurchfahrt von ist seit Juli gesperrt.<br>Wir möchten Sie darauf hinweisen, dass die Zufahrt trotzdem ohne Probleme möglich ist. Bitte folgen Sie hier der Umleitungs-Beschilderung. Wir hoffen, dass Sie trotz diesen Umständen den Weg zu uns finden.<br>Sollten Sie jedoch Hilfe benötigen können Sie uns gerne kontaktieren."
    ],
    [
        "Mai 2020: Öffnung unter Verhaltensregeln",
        "Liebe Gäste, wir öffnen unser Restaurant wieder ab dem 21.5.2020 für Sie!<br>Wir bitten Sie sich bei Ihrem Besuch an die Verhaltensregeln zu halten, die sie natürlich auch den ausgehängten Schildern entnehmen können. Bitte unterstützen Sie uns dabei, allen einen sicheren und schönen Besuch bei uns zu ermöglichen.<br>Es ergeben sich dadurch auch einige Neuerungen:<br><br>Geänderte Öffnungszeiten: wir sind nun Freitag von 15 – 21 Uhr und Samstag und Sonntag durchgehend (11- 21 Uhr) für Sie da. Die Küche ist jeweils durchgehend bis 20 Uhr geöffnet. Wir bitten Sie zu den Hauptgeschäftszeiten (Samstag und Sonntag 12 – 14 Uhr und 17 – 19 Uhr) einen Tisch zu reservieren.<br><br>Angepasste Speisekarte: Wir bieten in diesen Zeiten durchgehend warme Küche an. Unsere aktuelle Speisekarte finden Sie <a href=\"./menu.html\">hier</a>. Neu sind auch unsere Kaffeespezialitäten und selbstgemachten Kuchen.<br><br>Gerne können Sie unsere Gerichte auch abholen und bei Ihnen zu Hause genießen."
    ],
    [
        "Wir freuen uns, Sie sobald wie möglich wieder im Heiß und Fettig begrüßen zu dürfen!",
        ""
    ]
]*/