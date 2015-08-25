var React = require('react');
var Router = require('react-router').Router;
var Provider = require('react-redux').Provider;

var router = React.createFactory(Router);
var provider = React.createFactory(Provider);

function root(store, routerProps) {
    return provider({ store: store }, function() {
        return router(routerProps);
    });
}

module.exports = root;
