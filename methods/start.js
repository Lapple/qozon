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

    de.server.route = function(req, res, context) {
        var pathname = context.request.url.pathname || '';

        if (pathname.charAt(0) === '/') {
            pathname = pathname.substr(1);
        }

        if (pathname === 'models.jsx') {
            return pathname;
        } else {
            return 'index.jsx';
        }
    };

    de.server.init({
        port: options.port,
        rootdir: options.rootdir,
        modules: modules
    });

    de.sandbox.assert = assert;

    de.server.start();
}

module.exports = start;
