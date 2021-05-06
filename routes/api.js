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

router.get('/', function (req, res, next) {
    res.sendFile(path.join(__dirname + "/../views/apiUsage.html"))
});

router.get('/user/:uid',
    function (req, res, next) {
        var uid = req.params.uid
        if (/*FIXME remove "!"*/!Privileges.hasPrivilege(req.session.privs, Privileges.Coworker) || req.session.uid === uid) {
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

//TODO Real API
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

//TODO Real API
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

//TODO Real API
router.delete('/account/delete', function (req, res, next) {
    if (Privileges.hasPrivilege(req.session.privs, Privileges.Admin) || req.session.uid === req.body.uid) {
        res.sendStatus(200)
    } else { //Insufficient permissions
        res.sendStatus(401);
    }
});

//TODO Remove when Database comes
news = [
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
]

//TODO Real API
router.get('/news/new', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json')
    res.write(JSON.stringify({ title: news[0][0], message: news[0][1] }))
    res.end()
});

//TODO Real API
router.get('/news/all', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json')
    res.write(JSON.stringify({ news: news }))
    res.end()
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


module.exports = router;