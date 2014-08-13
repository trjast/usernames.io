var express = require('express');
var isBrowser = require('user-agent-is-browser');
var api = require('./api');
var available = require('./available');
var render = require('./render');
var path = require('path');

var port = process.env.port || 1337;

var server = express();
server.use(express.static(path.join(__dirname, 'public')));


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

server.get("/available/:service/:username", function (req, res) {
    available.check(req.params.service, req.params.username).done(function (isAvailable) {
        res.send({ "service": req.params.service.toString(), "username": req.params.username.toString(), "available": isAvailable });
    }, function (fail) {
        res.status(500).send();
    });
});

server.listen(port, function () {
    console.log("server up on " + port);
});