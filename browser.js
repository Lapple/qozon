exports.start = function() {
    throw new Error('qozon.start is not available in the browser.');
};
exports.bootstrap = require('./lib/bootstrap');
exports.createStore = require('./lib/create-store');
exports.connect = require('./lib/connect');
