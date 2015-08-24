var React = require('react');
var Router = require('react-router').Router;
var Provider = require('react-redux').Provider;

var history = require('react-router/lib/BrowserHistory').history;

function bootstrap(options) {
    document.addEventListener('DOMContentLoaded', function() {
        var router = React.createFactory(Router);
        var provider = React.createFactory(Provider);

        var store = options.store;

        var models = JSON.parse(
            document.getElementById('models').innerHTML.trim()
        );

        store.dispatch({
            type: 'POPULATE_MODELS',
            models: models
        });

        React.render(
            provider({
                store: store
            }, function() {
                return router({
                    history: history,
                    children: options.routes
                });
            }),
            document.getElementById('app')
        );
    });
}

module.exports = bootstrap;
