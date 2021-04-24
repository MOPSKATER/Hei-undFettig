var express = require('express');
const Accountmanager = require('../accountmanager');
const Privileges = require('../privileges');
var privileges = require('../privileges')
var router = express.Router();
const path = require('path');

router.get('/', function (req, res, next) {
    res.sendFile(path.join(__dirname + "/../views/apiUsage.html"))
});

//TODO Real API
router.get('/user/:uid', function (req, res, next) {
    if (/*FIXME remove "!"*/!Privileges.hasPrivilege(req.session.privs, Privileges.Coworker) || req.session.uid === req.params.uid) {
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify({
            prename: "Peter", name: "Pan", points: 50, street: "Hafenstr. 49",
            city: "Albcity", additionalAddress: "", postcode: "123456", accessLevel: Privileges.Guest
        }))
        res.end();
    } else { //Insufficient permissions
        res.sendStatus(401);
    }
});

//TODO Real API
router.post('/account/login', function (req, res, next) {
    data = Accountmanager.login(req)
    if (data) {
        res.setHeader('Content-Type', 'application/json')
        res.write(JSON.stringify(data))
        res.end()
    } else { //Insufficient permissions
        res.sendStatus(401)
    }
});

//TODO Real API
router.post('/account/logout', function (req, res, next) {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        }
        else
            res.sendStatus(200);
    });
});

//TODO Real API
router.post('/account/register', function (req, res, next) {
    data = Accountmanager.register(req)
    if (data) {
        res.setHeader('Content-Type', 'application/json')
        res.write(JSON.stringify(data))
        res.end()
    } else { //Account aready exists
        res.sendStatus(409)
    }
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
        "Januar 2021",
        "Liebe Gäste, wir wünschen Ihnen und Ihrer Familie ein gutes und gesundes neues Jahr!"
    ],
    [
        "Weihnachten 2020",
        "Sie suchen für Ihre Lieben noch ein Weihnachtsgeschenk? Bei uns erhalten Sie Gutscheine (Betrag nach Wahl), Schnaps aus unserer historischen Schnapsbrennerei oder selbstgemachte Liköre. Schreiben Sie und eine E-Mail oder rufen Sie uns an."
    ],
    [
        "Dezember 2020",
        "Liebe Gäste, unser Restaurant bleibt bis zum Ende des Lockdown geschlossen.<br>Wir wünschen Ihnen und Ihrer Familie ein schönes Weihnachtsfest und ein gutes, gesundes Jahr 2021.<br>Auf ein baldiges Wiedersehen"
    ],
    [
        "Juli 2020",
        "Liebe Gäste, die Ortsdurchfahrt von ist seit Juli gesperrt.<br>Wir möchten Sie darauf hinweisen, dass die Zufahrt trotzdem ohne Probleme möglich ist. Bitte folgen Sie hier der Umleitungs-Beschilderung. Wir hoffen, dass Sie trotz diesen Umständen den Weg zu uns finden.<br>Sollten Sie jedoch Hilfe benötigen können Sie uns gerne kontaktieren."
    ],
    [
        "Mai 2020",
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
    res.write(JSON.stringify({ date: news[0][0], message: news[0][1] }))
    res.end()
});

//TODO Real API
router.get('/news/all', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json')
    res.write(JSON.stringify({ news: news }))
    res.end()
});

//TODO Real API
router.POST('/cart/add', function (req, res, next) {
    if (Accountmanager.isLoggedIn) {
        //TODO manage database
        res.sendStatus(200)
    }
    res.sendStatus(401)
});

//TODO Real API
router.POST('/cart/remove', function (req, res, next) {
    if (Accountmanager.isLoggedIn) {
        //TODO manage database
        res.sendStatus(200)
    }
    res.sendStatus(401)
});


module.exports = router;