var express = require('express');
var isBrowser = require('user-agent-is-browser');
var api = require('./api');
var render = require('./render');

var port = process.env.port || 1337;

var server = express();

server.get("/", function (req, res) {
    api.get().done(function (username) {
        if (isBrowser(req.headers['user-agent'])) {
            res.send(render("main",{ user: username }));
        } else {
            res.send({ username: username });
        }
    }, function (fail) {
        var message = "couldn't generate username";
        if (isBrowser(req.headers['user-agent'])) {
            res.send(500, render("error", { message: message }));
        } else {
            res.send(500, { message: message });
        }
    });
});

server.listen(port, function () {
    console.log("server up on " + port);
});