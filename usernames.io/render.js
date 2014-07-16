var fs = require('fs');
var swig = require('swig');

module.exports = function (filename, model) {
    return swig.renderFile(__dirname + "/views/" + filename + ".html", model);
};