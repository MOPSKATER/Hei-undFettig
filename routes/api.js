var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.render("apiUsage");
});

router.get('/:uid', function (req, res, next) {
    res.end(req.params.user);
});


module.exports = router;
