var qozon = require('qozon');

var routes = require('./routes');
var store = require('./store');

qozon.bootstrap({
    routes: routes,
    store: store
});
