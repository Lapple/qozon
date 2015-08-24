var React = require('react');
var Router = require('react-router').Router;
var Provider = require('react-redux').Provider;

var router = React.createFactory(Router);
var provider = React.createFactory(Provider);

function root(store, routerParams) {
    return provider({ store: store }, function() {
        return router(routerParams);
    });
}

module.exports = root;
