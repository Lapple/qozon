exports.start = function() {
    throw new Error('qozon.start is not available in the browser.');
};
exports.bootstrap = require('./methods/bootstrap');
exports.createStore = require('./methods/create-store');
exports.connect = require('./methods/connect');
exports.request = require('./methods/request');
