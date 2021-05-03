var sqlite3 = require('sqlite3')

const DBSOURCE = "db.sqlite"
const db = new sqlite3.Database("db.sqlite", (err) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
})

db.run("CREATE TABLE IF NOT EXISTS users (prename text, name text, street text, number text, place text, plz integer, email text, salt text, password text, permissionlevel integer)");
db.run("CREATE TABLE IF NOT EXISTS cart (id integer, itemid integer, ordered integer)");
db.run("CREATE TABLE IF NOT EXISTS item (name text, description text, price decimal)");
db.run("CREATE TABLE IF NOT EXISTS news (caption text, text text, date date)");


const Databasemanager = {

}


module.exports = Databasemanager;