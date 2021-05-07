var express = require('express');
var validate = require("validate.js")
const Accountmanager = require('../accountmanager');
var Database = require("../databasemanager")
const Privileges = require('../privileges');
var privileges = require('../privileges')
var router = express.Router();
const path = require('path');
const { validators } = require('validate.js');
const { login, setSession } = require('../accountmanager');
const { table } = require('console');

var unsafe = "" // "<>=\"\""

module.exports = unsafe;

router.get('/', function (req, res, next) {
    res.sendFile(path.join(__dirname + "/../views/apiUsage.html"))
});

router.get('/user/:uid',
    function (req, res, next) {
        var uid = req.params.uid
        if (Privileges.hasPrivilege(req.session.privs, Privileges.Coworker) || req.session.uid === uid) {
            var err = validate({ uid: uid }, { uid: { length: { is: 16 }, format: { pattern: "[a-zA-Z0-9]+" } } })
            if (err) {
                res.statusCode = 400;
                res.write(JSON.stringify(err))
                res.end()
                return
            }
            Database.getUserData(uid, (err, table) => {
                if (err) {
                    res.statusCode = 500
                    res.write(err)
                }
                else {
                    if (table) {
                        res.set({ 'Content-Type': 'application/json' });
                        res.write(JSON.stringify(table)) //FIXME Don't send all data!
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
    var err = validate(data, { email: { presence: true, email: true }, password: { length: { is: 64 }, format: { pattern: "[0-9a-f]+" } } })
    if (err) {
        res.statusCode = 400
        res.write(JSON.stringify(err))
        res.end()
    }
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
                req.session.isLoggedIn = true;
                res.setHeader('Content-Type', 'application/json')
                username = data.prename ? data.prename : req.body.email
                res.write(JSON.stringify({ username: username, points: data.points, accessLevel: data.accessLevel, uid: data.uid }))
                res.end()
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
    //Validation
    var data = { email: req.body.email, salt: "", hash: req.body.password }
    err = validate(data, { email: { presence: true, email: true }, hash: { presence: true, length: { is: 64 }, format: { pattern: "[0-9a-f]+" } } })
    if (err) {
        statusCode = 400
        res.write(JSON.stringify(err))
        res.end()
        return
    }

    Accountmanager.register(data, (err, uid) => {
        if (err) {
            statusCode = 400
            res.write(JSON.stringify(err))
        } else {
            req.session.isLoggedIn = true;
            res.write(JSON.stringify({ uid: uid }))
        }
        res.end()
    })
});

router.get('/account/isLoggedin', function (req, res, next) {
    Accountmanager.isLoggedIn(req) ? req.sendStatus(200) : req.sendStatus(401)
});

//TODO Real API
router.put('/account/set', function (req, res, next) {
    if (req.session.uid === req.body.uid) {
        //TODO Set new data
        res.sendStatus(200)
    } else { //Insufficient permissions
        res.sendStatus(401);
    }
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
                res.write(JSON.stringify(news[-1]))
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
    if (!Privileges.hasPrivilege(req.session.privs, Privileges.Admin)) {
        statusCode = 401
        res.end()
        return
    }

    data = { id: req.body.id, caption: req.body.caption, text: req.body.text }
    err = validate(data, {
        id: { presence: true, numericality: true, length: { maximum: 1 } }, caption: { presence: true, pattern: "[0-9a-zA-Z" + unsafe + "]+", length: { maximum: 30 } },
        text: { pattern: "[0-9a-zA-Z" + unsafe + "]+", length: { maximum: 200 } }
    })
    if (err) {
        statusCode = 400
        res.write(JSON.stringify(err))
        res.end()
        return
    }
    var date = new Date(Date.now()),
        month = "0" + (d.getMonth() + 1),
        day = "0" + d.getDate(),
        year = d.getFullYear();

    data.date = [year, month.slice(-2), day.slice(-2)].join("-")

    Database.addNews(data, (err) => {
        if (err) {
            res.statusCode = 400
            res.write(JSON.stringify(err))
        }
        res.end()
    })
});

router.post('/news/remove', function (req, res, next) {
    if (!Privileges.hasPrivilege(req.session.privs, Privileges.Admin)) {
        statusCode = 401
        res.end()
        return
    }

    data = { id: req.body.id }
    err = validate(data, { id: { presence: true, numericality: true, length: { maximum: 1 } } })
    if (err) {
        statusCode = 400
        res.write(JSON.stringify(err))
        res.end()
        return
    }

    Database.deleteNews(req.body.id, (err) => {
        if (err) {
            res.statusCode = 400
            res.write(JSON.stringify(err))
        }
        res.end()
    })
});

router.delete('/news/delete', function (req, res, next) {
});

//TODO Real API
router.post('/cart/add', function (req, res, next) {
    if (Accountmanager.isLoggedIn) {
        //TODO manage database
        res.sendStatus(200)
    }
    res.sendStatus(401)
});

//TODO Real API
router.post('/cart/remove', function (req, res, next) {
    if (Accountmanager.isLoggedIn) {
        //TODO manage database
        res.sendStatus(200)
    }
    res.sendStatus(401)
});

//TODO Real API
router.get('/cart/get', function (req, res, next) {
    if (Accountmanager.isLoggedIn) {
        //TODO manage database
        res.sendStatus(200)
    }
    res.sendStatus(401)
});

//TODO Real API
router.post('/cart/order', function (req, res, next) {
    if (Accountmanager.isLoggedIn) {
        //TODO manage database
        res.sendStatus(200)
    }
    res.sendStatus(401)
});

//TODO
router.get('/orders/all', function (req, res, next) {
});

//TODO
router.delete('/orders/delete', function (req, res, next) {
});

module.exports = router;