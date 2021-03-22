#!/usr/bin/env node

var http = require("http");
http.createServer(function (request, response) {
    response.end("Test");
}).listen(1337);