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
        db.prepare("INSERT INTO news (id, caption, text, date) VALUE (? ? ? ?)").run(data.id, data.caption, data.text, data.date, () => {
            callback(err)
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