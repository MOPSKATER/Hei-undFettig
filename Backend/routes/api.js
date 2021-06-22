var express = require('express');
var validate = require("validate.js")
const Accountmanager = require('../accountmanager');
const Database = require("../databasemanager")
const Privileges = require('../privileges');
const Ruleset = require('../ruleset');
var router = express.Router();
const path = require('path');
var cors = require("cors")

router.use(cors({ credentials: true, origin: process.env.frontend, withCredentials: true }))

router.get('/', function (req, res, next) {
    res.sendFile(path.join(__dirname + "/../views/apiUsage.html"))
});

router.get('/user/:uid', function (req, res, next) {
    var uid = req.params.uid
    if (Privileges.hasPrivilege(req.session.accessLevel, Privileges.Coworker) || req.session.uid === uid) {
        var err = validate({ uid: uid }, { uid: { length: { is: 16 }, format: { pattern: "[a-zA-Z0-9]+" } } })

        if (printErr(err, res))
            return

        Database.getUserData(uid, (err, table) => {
            if (err) {
                res.statusCode = 500
                res.write(err)
            }
            else {
                if (table) {
                    delete table.salt;
                    delete table.password;
                    res.set({ 'Content-Type': 'application/json' });
                    res.write(JSON.stringify(table))
                }
                else
                    res.statusCode = 404
            }
            res.end();
        });
    } else { //Insufficient permissions
        res.sendStatus(401);
    }

});

router.post('/account/login', function (req, res, next) {
    if (req.body.email === "Admin") {
        var admin = true
        req.body.email = "admin@heiss.fettig"
    }
    var data = { email: req.body.email, password: req.body.password }
    var err = validate(data, { email: Ruleset.EMail, password: Ruleset.Password })

    if (printErr(err, res))
        return

    else {
        if (admin) {
            req.body.email = "Admin"
            data.email = "Admin"
        }
        Accountmanager.login(req, (err, data) => {
            if (err) {
                res.statusCode = 401
                res.write(JSON.stringify(err))
                res.end()
            }
            else {
                Database.getCart(data.uid, (err, cart) => {
                    if (err) {
                        res.statusCode = 400
                        res.write(JSON.stringify(err))
                    }
                    else {
                        req.session.uid = data.uid
                        req.session.accessLevel = data.accessLevel
                        res.setHeader('Content-Type', 'application/json')
                        username = data.prename ? data.prename : req.body.email
                        req.session.cart = cart
                        res.write(JSON.stringify({ username: username, points: data.points, accessLevel: data.accessLevel, uid: data.uid }))
                        res.end()
                    }
                })
            }
        })
    }
});

router.post('/account/logout', function (req, res, next) {
    req.session.destroy((err) => {
        if (err) {
            statusCode = 500
            res.write(JSON.stringify(err))
            res.end()
            return
        }
        else
            res.sendStatus(200);
    });
});

router.post('/account/register', function (req, res, next) {
    var data = { email: req.body.email, salt: "", password: req.body.password }
    err = validate(data, { email: Ruleset.EMail, password: Ruleset.Password })

    if (printErr(err, res))
        return

    Accountmanager.register(data, (err, uid) => {
        if (err) {
            statusCode = 400
            res.write(JSON.stringify(err))
        } else {
            req.session.uid = uid
            req.session.accessLevel = Privileges.Guest
            req.session.cart = []
            res.write(JSON.stringify({ uid: uid, accessLevel: Privileges.Guest }))
        }
        res.end()
    })
});

router.get('/account/isLoggedin', function (req, res, next) {
    Accountmanager.isLoggedIn(req) ? res.sendStatus(200) : res.sendStatus(401)
});

router.put('/account/set', function (req, res, next) {
    if (Accountmanager.isLoggedIn(req)) {
        res.statusCode = 401
        res.end()
        return
    }

    data = req.body

    if (!Object.keys(data).length) {
        err = "Nothing to set"
        printErr(err, res)
        return
    }

    err = validate(data, {
        prename: Ruleset.Name, name: Ruleset.Name, email: Ruleset.Changeemail,
        street: Ruleset.street, number: Ruleset.Number, plz: Ruleset.Plz, place: Ruleset.Place, password: Ruleset.ChangePassword
    })

    if (printErr(err, res))
        return

    Database.setData(req.session.uid, data, (err) => {
        if (err) {
            res.statusCode = 500
            res.write(JSON.stringify(err))
        }
        res.end()
    })
});

router.delete('/account/delete', function (req, res, next) {
    if (req.session.uid === req.body.uid) {
        Database.deleteUser(uid, (err) => {
            if (err) {
                res.statusCode = 400
                res.write(JSON.stringify(err))
            }
            else {
                res.sendStatus(200)
            }
            res.end()
        })
    } else { //Insufficient permissions
        res.sendStatus(401);
    }
});

router.get('/news/new', function (req, res, next) {
    Database.getNews((err, news) => {
        if (err)
            res.write(JSON.stringify(err))
        else {
            if (news.length) {
                res.setHeader('Content-Type', 'application/json')
                res.write(JSON.stringify(news[news.length - 1]))
            }
            else
                res.sendStatus(404)
        }
        res.end()
    })
});

router.get('/news/all', function (req, res, next) {
    Database.getNews((err, news) => {
        if (err)
            res.write(JSON.stringify(err))
        else {
            if (news.length) {
                res.setHeader('Content-Type', 'application/json')
                res.write(JSON.stringify(news))
            }
            else
                res.sendStatus(404)
        }
        res.end()
    })
});

router.post('/news/add', function (req, res, next) {
    if (Privileges.hasPrivilege(req.session.privs, Privileges.Admin)) {
        res.sendStatus(401)
        res.end()
        return
    }

    data = { id: req.body.id, caption: req.body.caption, text: req.body.text }
    err = validate(data, {
        id: { presence: true, numericality: true }, caption: Ruleset.Caption,
        text: Ruleset.Text
    })

    if (printErr(err, res))
        return

    var date = new Date(Date.now()),
        month = "0" + (date.getMonth() + 1),
        day = "0" + date.getDate(),
        year = date.getFullYear();

    data.date = [year, month.slice(-2), day.slice(-2)].join("-")

    Database.addNews(data, (err) => {
        if (err) {
            res.statusCode = 400
            res.write(JSON.stringify(err))
        }
        res.end()
    })
});

router.delete('/news/edit', function (req, res, next) {
    if (Privileges.hasPrivilege(req.session.privs, Privileges.Admin)) {
        res.statusCode = 401
        res.end()
        return
    }

    data = { id: req.body.id, caption: req.body.caption, text: req.body.text }
    err = validate(data, {
        id: Ruleset.Id, caption: Ruleset.Caption,
        text: Ruleset.Text
    })

    if (printErr(err, res))
        return

    var date = new Date(Date.now()),
        month = "0" + (date.getMonth() + 1),
        day = "0" + date.getDate(),
        year = date.getFullYear();

    data.date = [year, month.slice(-2), day.slice(-2)].join("-")

    Database.editNews(data, (err) => {
        if (err) {
            res.statusCode = 400
            res.write(JSON.stringify(err))
        }
        res.end()
    })
});

router.delete('/news/delete', function (req, res, next) {
    if (Privileges.hasPrivilege(req.session.privs, Privileges.Admin)) {
        res.statusCode = 401
        res.end()
        return
    }

    data = { id: req.body.id }
    err = validate(data, { id: Ruleset.Id })

    if (printErr(err, res))
        return

    Database.deleteNews(req.body.id, (err) => {
        if (err) {
            res.statusCode = 400
            res.write(JSON.stringify(err))
        }
        res.end()
    })
});

router.post('/cart/add', function (req, res, next) {
    if (!Accountmanager.isLoggedIn(req)) {
        res.sendStatus(401)
        return
    }

    err = validate({ id: req.body.id }, { id: Ruleset.Id })

    if (printErr(err, res))
        return

    if (req.body.id >= 0 && req.body.id < 6)
        Database.addCart(req.session.uid, req.body.id, (err) => {
            if (err) {
                res.statusCode = 500
                res.write(JSON.stringify(err))
            }
            res.end()
        })
    else {
        res.statusCode = 400
        res.write(JSON.stringify("Invalid id"))
        res.end()
    }
});

router.post('/cart/remove', function (req, res, next) {
    if (!Accountmanager.isLoggedIn(req)) {
        res.sendStatus(401)
        return
    }

    err = validate({ id: req.body.id }, { id: Ruleset.Id })

    if (printErr(err, res))
        return

    if (req.body.id >= 0 && req.body.id < 6)
        Database.updateCountCart(req.session.uid, req.body.id, 0, (err) => {
            if (err) {
                res.statusCode = 500
                res.write(JSON.stringify(err))
            }
            res.end()
        })
    else {
        res.statusCode = 400
        res.write("Invalid id")
        res.end()
    }
});

router.get('/cart/get', function (req, res, next) {
    if (!Accountmanager.isLoggedIn(req)) {
        res.sendStatus(401)
        return
    }

    Database.getCart(req.session.uid, (err, table) => {
        if (err) {
            res.statusCode = 500
            res.write(JSON.stringify(err))
        }
        else
            res.write(JSON.stringify(table))
        res.end()
    })
});

router.post('/cart/updateCount', function (req, res, next) {
    if (!Accountmanager.isLoggedIn) {
        res.sendStatus(401)
        return
    }

    err = validate({ id: req.body.id, count: req.body.count }, { id: Ruleset.Id, count: Ruleset.Count })

    if (printErr(err))
        return

    Database.updateCountCart(req.session.uid, req.body.id, req.body.count, (err) => {
        if (err) {
            res.statusCode = 500
            res.write(JSON.stringify(err))
        }
        res.end()
    })
});

router.post('/item/get', function (req, res, next) {
    if (!Accountmanager.isLoggedIn) {
        res.sendStatus(401)
        return
    }

    err = validate({ id: req.body.id }, { id: Ruleset.Id })

    if (printErr(err))
        return

    Database.getItem(req.body.id, (err, table) => {
        if (err) {
            res.statusCode = 500
            res.write(JSON.stringify(err))
        }
        else
            res.write(JSON.stringify(table))
        res.end()
    })
});

router.post('/cart/order', function (req, res, next) {
    if (!Accountmanager.isLoggedIn(req)) {
        res.sendStatus(401)
        return
    }

    data = { datetime: req.body.datetime }
    err = validate(data, { datetime: Ruleset.Datetime })

    if (printErr(err))
        return

    Database.orderCart(req.session.uid, req.body.datetime, (err) => {
        if (err) {
            res.statusCode = 500
            res.write(JSON.stringify(err))
        }
        res.end()
    })

});

router.get('/orders/get', function (req, res, next) {
    if (!Privileges.hasPrivilege(req.session.accessLevel, Privileges.Coworker)) {
        res.sendStatus(401)
        return
    }

    Database.getOrders((err, table) => {
        if (err) {
            statusCode = 500
            res.write(JSON.stringify(err))
        }
        else
            if (table)
                res.write(JSON.stringify(table))
            else
                res.statusCode = 404
        res.end()
    })
});

router.delete('/orders/delete', function (req, res, next) {
    if (!Privileges.hasPrivilege(req.session.accessLevel, Privileges.Coworker)) {
        res.sendStatus(401)
        return
    }

    err = validate({ uid: req.body.uid, datetime: req.body.datetime }, { uid: Ruleset.Uid, datetime: Ruleset.Datetime })

    if (printErr(err, res))
        return

    Database.deleteOrder(uid, datetime, (err) => {
        if (err) {
            statusCode = 500
            res.write(JSON.stringify(err))
        }
        res.end()
    })
});

function printErr(err, res) {
    if (err) {
        res.statusCode = 400;
        res.write(JSON.stringify(err))
        res.end()
        return true
    }
    return false
}

module.exports = router;