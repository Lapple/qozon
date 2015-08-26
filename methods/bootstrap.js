var stringify = require('querystring').stringify;

var pff = require('pff');
var render = require('react-dom').render;
var Promise = require('promise');
var extend = require('extend');
var history = require('react-router/lib/BrowserHistory').history;

var C = require('../lib/consts');
var after = require('../lib/after');
var modelKey = require('../lib/model-key');
var extractModels = require('../lib/extract-models');
var rootComponent = require('../lib/root-component');

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
        var request = new ModelsRequest();

        Promise.all(
            Object.keys(models).map(function(key) {
                var model = models[key];

                var cache = store.getState().cache;
                var cachedModelKey = modelKey(model.id, model.params);
                var cachedModel = cache[cachedModelKey];

                if (cachedModel) {
                    return new Promise(function(resolve) {
                        resolve(
                            pair(key, {
                                key: cachedModelKey,
                                data: cachedModel
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

function ModelsRequest() {
    var xhr = new XMLHttpRequest();

    this.descriptors = [];

    this.promise = new Promise(function(resolve, reject) {
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    resolve(
                        JSON.parse(xhr.responseText)
                    );
                } else {
                    reject(xhr.status);
                }
            }
        };
    });

    this.xhr = xhr;
}

ModelsRequest.prototype.add = function(componentKey, model) {
    this.descriptors.push({
        key: componentKey,
        id: model.id,
        params: model.params
    });

    return this.promise;
};

ModelsRequest.prototype.send = function() {
    var xhr = this.xhr;

    if (this.descriptors.length === 0) {
        xhr.abort();
        return;
    }

    // FIXME: The part with having to put `models.jsx` file into application
    // folder while the pathname hardcoded here needs to have some thought.
    xhr.open('POST', '/models.jsx', true);

    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send(
        stringify(
            this.descriptors.reduce(function(acc, descriptor) {
                var params = descriptor.params;

                acc[paramName(C.MODEL_ID_PARAM_NAME)] = descriptor.id;

                Object.keys(params).forEach(function(k) {
                    acc[paramName(k)] = params[k];
                });

                return acc;

                function paramName(name) {
                    return pff('%s.%s', descriptor.key, name);
                }
            }, {})
        )
    );
};

function pair(key, value) {
    var p = {};
    p[key] = value;
    return p;
}

module.exports = bootstrap;
