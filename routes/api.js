var express = require('express');
const Accountmanager = require('../accountmanager');
const Privileges = require('../privileges');
var privileges = require('../privileges')
var router = express.Router();
const path = require('path');
const { Console } = require('console');

router.get('/', function (req, res, next) {
    //res.render("apiUsage");
    res.sendFile(path.join(__dirname + "/../views/apiUsage.html"))
});

router.get('/user/:uid', function (req, res, next) {
    if (Privileges.hasPrivilege(req.session.privs, Privileges.Coworker) || req.session.uid == req.params.uid) {
        res.setHeader('Content-Type', 'application/json')
        res.write('<p>expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>')
        res.end()
    } else { //Insufficient permissions
        res.sendStatus(401)
    }
});

router.post('/account/login', function (req, res, next) {
    data = Accountmanager.login(req.body)
    if (data) {
        res.setHeader('Content-Type', 'application/json')
        res.write(JSON.stringify(data))
        res.end()
    } else { //Insufficient permissions
        res.sendStatus(401)
    }
});

router.post('/account/logout', function (req, res, next) {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        }
        res.sendStatus(200);
    });
});


module.exports = router;