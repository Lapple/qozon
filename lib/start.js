var path = require('path');
var assert = require('assert');

var de = require('descript');
var extend = require('extend');

function start(options) {
    var modules = {
        // FIXME: Find a way to determine path dynamically
        qozon: 'node_modules/qozon/lib/descript-module'
    };

    if (options.modules) {
        modules = extend(modules, options.modules);
    }

    de.server.init({
        port: options.port,
        rootdir: options.rootdir,
        modules: modules
    });

    de.sandbox.assert = assert;

    de.server.start();
}

module.exports = start;
