var React = require('react');
var history = require('react-router/lib/BrowserHistory').history;

var rootComponent = require('./root-component');

function bootstrap(options) {
    document.addEventListener('DOMContentLoaded', function() {
        var store = options.store;

        var models = JSON.parse(
            document.getElementById('models').innerHTML.trim()
        );

        store.dispatch({
            type: 'POPULATE_MODELS',
            models: models
        });

        React.render(
            rootComponent(store, {
                history: history,
                children: options.routes
            }),
            document.getElementById('app')
        );
    });
}

module.exports = bootstrap;
