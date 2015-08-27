var render = require('react-dom').render;
var Promise = require('promise');
var extend = require('extend');
var history = require('react-router/lib/BrowserHistory').history;

var C = require('../lib/consts');
var after = require('../lib/after');
var computeCacheKey = require('../lib/compute-cache-key');
var extractModels = require('../lib/extract-models');
var rootComponent = require('../lib/root-component');
var ModelsRequest = require('../lib/models-request');

function bootstrap(options) {
    var store = options.store;

    document.addEventListener('DOMContentLoaded', function() {
        var models = JSON.parse(
            document.getElementById(C.MODELS_CONTAINER_ID).innerHTML.trim()
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
            document.getElementById(C.APP_CONTAINER_ID)
        );
    });

    function onRouterUpdate() {
        var models = extractModels(this.state);
        var request = new ModelsRequest();

        store.dispatch({
            type: 'FLUSH_MODELS',
            models: models
        });

        var cache = store.getState().cache;

        Promise.all(
            Object.keys(models).map(function(key) {
                var model = models[key];

                var modelKey = computeCacheKey(model.id, model.params);
                var cachedModelData = cache[modelKey];

                if (cachedModelData) {
                    return new Promise(function(resolve) {
                        resolve(
                            pair(key, {
                                key: modelKey,
                                data: cachedModelData
                            })
                        );
                    });
                }

                return request.add(key, model);
            })
        ).done(function(data) {
            populate(
                store,
                data.reduce(function(acc, m) {
                    return extend(acc, m);
                }, {})
            );
        });

        request.send();
    }
}

function populate(store, models) {
    store.dispatch({
        type: 'POPULATE_MODELS',
        models: models
    });
}

function pair(key, value) {
    var p = {};
    p[key] = value;
    return p;
}

module.exports = bootstrap;
