var stringify = require('querystring').stringify;

var pff = require('pff');
var render = require('react-dom').render;
var history = require('react-router/lib/BrowserHistory').history;

var C = require('./consts');
var after = require('./after');
var extractModels = require('./extract-models');
var rootComponent = require('./root-component');

function bootstrap(options) {
    var store = options.store;

    document.addEventListener('DOMContentLoaded', function() {
        var models = JSON.parse(
            document.getElementById('models').innerHTML.trim()
        );

        populate(store, models);

        render(
            rootComponent(store, {
                history: history,
                children: options.routes,
                // Ignoring first update, the one that happens on initialization,
                // no need to request data, it's already provided.
                onUpdate: after(1, onRouterUpdate)
            }),
            document.getElementById('app')
        );
    });

    function onRouterUpdate() {
        var models = extractModels(this.state);

        var params = Object.keys(models).reduce(function(acc, key) {
            var descriptor = models[key];
            var params = descriptor.params;

            acc[paramName(C.MODEL_ID_PARAM_NAME)] = descriptor.id;

            Object.keys(params).forEach(function(k) {
                acc[paramName(k)] = params[k];
            });

            return acc;

            function paramName(name) {
                return pff('%s.%s', key, name);
            }
        }, {});

        // TODO: Need to have caching layer somewhere here.

        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                populate(
                    store,
                    JSON.parse(xhr.responseText)
                );
            }
        };

        // FIXME: The part with having to put `models.jsx` file into application
        // folder while the pathname hardcoded here needs to have some thought.
        xhr.open('POST', '/models.jsx', true);

        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.send(stringify(params));
    }
}

function populate(store, models) {
    store.dispatch({
        type: 'POPULATE_MODELS',
        models: models
    });
}

module.exports = bootstrap;
