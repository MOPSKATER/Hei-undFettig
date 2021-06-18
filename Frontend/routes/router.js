var express = require('express');
var router = express.Router();
var fs = require('fs');

let javascripts = {}

function loadJavaScripts(dir) {
    fs.readdir(dir, function (err, filenames) {
        if (err) {
            console.log(err)
            process.exit(0)
        }
        filenames.forEach((filename) => {
            if (filename !== "util")
                fs.readFile(dir + filename, "utf-8", (err, content) => {
                    if (err) {
                        console.log(err)
                        process.exit(0)
                    }
                    javascripts[filename] = content.replace(/<%= api %>/g, process.env.api)
                });
            else
                loadJavaScripts(dir + "util/")
        });
    });
}

loadJavaScripts(__dirname + "/javascripts/")

router.get('/:file', function (req, res, next) {
    res.send(javascripts[req.params.file])
});

router.get('/util/:file', function (req, res, next) {
    res.send(javascripts[req.params.file])
});

module.exports = router;