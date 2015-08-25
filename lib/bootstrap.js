var render = require('react-dom').render;
var history = require('react-router/lib/BrowserHistory').history;

var extractModels = require('./extract-models');
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

        render(
            rootComponent(store, {
                history: history,
                children: options.routes,
                // FIXME: Don't call the callback on first update, since the
                // data is already available from the server.
                onUpdate: function() {
                    console.log(extractModels(this.state));
                }
            }),
            document.getElementById('app')
        );
    });
}

module.exports = bootstrap;
