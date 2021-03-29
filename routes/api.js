var express = require('express');
var privileges = require('../privileges')
var router = express.Router();

router.get('/', function (req, res, next) {
    res.render("apiUsage");
});

router.get('/:uid', function (req, res, next) {
    if (privileges.hasPrivilege(req.session.privs, privileges.Coworker) || req.session.uid == req.params.uid) {
        req.session.views++
        res.setHeader('Content-Type', 'text/html')
        res.write('<p>views: ' + req.session.views + '</p>')
        res.write('<p>expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>')
        res.end()
    } else { //Insufficient permissions
        res.sendStatus(401)
    }
});


module.exports = router;
