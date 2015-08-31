var redux = require('redux');
var extend = require('extend');

var computeCacheKey = require('../lib/compute-cache-key');

function baseReducer(reducer, state, action) {
    switch (action.type) {
        case 'POPULATE_MODELS':
            var models = action.models;

            // No need to create caches on the server.
            if (!process.browser) {
                return { models: models };
            }

            var cache = extractModelsToCache(models);

            return {
                models: models,
                cache: extend(state.cache, cache)
            };

        case 'FLUSH_MODELS':
            var models = action.models;

            var flushed = Object.keys(models).reduce(function(acc, id) {
                var descriptor = models[id];
                var key = computeCacheKey(descriptor.id, descriptor.params);
                var existingEntry = state.models[id];

                if (existingEntry && existingEntry.key !== key) {
                    acc[id] = null;
                }

                return acc;
            }, {});

            return {
                models: extend(state.models, flushed),
                cache: state.cache
            };

        case 'COMPONENT_ACTION':
            var updated = reducer(
                update.bind(null, state),
                action.models,
                action.originalAction
            );

            return updated || state;

        default:
            return state;
    }
}

function createStore(reducer) {
    function create() {
        return redux.createStore(
            baseReducer.bind(null, reducer),
            {}
        );
    }

    // While it's convenient to have a singleton store in browser, on the server
    // every request has to create a separate store.
    if (process.browser) {
        return create();
    } else {
        return create;
    }
}

function update(state, data, callback) {
    var updated = callback(data);

    return {
        cache: updateIn(state.cache, data, updated, 1),
        models: updateIn(state.models, data, updated, 2)
    };
}

function extractModelsToCache(models) {
    return Object.keys(models).reduce(function(acc, componentKey) {
        var model = models[componentKey];

        acc[model.key] = model.data;

        return acc;
    }, {});
}

function updateIn(object, a, b, depth) {
    if (depth === 0) {
        return object;
    }

    return Object.keys(object).reduce(function(acc, key) {
        var value = object[key];

        if (value === a) {
            acc[key] = b;
        } else {
            acc[key] = updateIn(value, a, b, depth - 1);
        }

        return acc;
    }, {});
}

module.exports = createStore;
