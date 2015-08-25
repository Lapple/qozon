var assert = require('assert');

var no = require('nommon');
var de = require('descript');

var renderToString = require('react-dom/server').renderToString;
var Router = require('react-router').Router;
var Location = require('react-router/lib/Location');

var C = require('./consts');
var request = require('./request');
var extractModels = require('./extract-models');
var rootComponent = require('./root-component');

exports.render = function(params, context) {
    assert.equal(typeof params.routes, 'object', 'params.routes is missing');
    assert.equal(typeof params.store, 'function', 'params.store is missing');

    var promise = new no.Promise();

    var request = context.request;
    var location = new Location(request.url.pathname, request.url.query);

    var store = params.store();

    Router.run(params.routes, location, function(error, state) {
        if (error) {
            promise.reject(
                new de.Result.Error(error)
            );
        } else {
            var data = new de.Block.Object(
                extractModels(state),
                {
                    // FIXME: No idea how this line removes the nesting of
                    // `result`, but it works.
                    result: '.'
                }
            ).run(null, context);

            data.fail(function(error) {
                promise.reject(
                    new de.Result.Error(error)
                );
            });

            data.done(function(data) {
                var models = data.result;

                store.dispatch({
                    type: 'POPULATE_MODELS',
                    models: models
                });

                promise.resolve(
                    new de.Result.HTML(
                        // TODO: Think of app-custom page layout template.
                        '<!doctype html>' +
                        '<div id="app">' +
                        renderToString(
                            rootComponent(store, state)
                        ) +
                        '</div>' +
                        '<script type="application/json" id="models">' +
                        JSON.stringify(models) +
                        '</script>' +
                        '<script src="//localhost:2002/index.compiled.js"></script>'
                    )
                );
            });
        }
    });

    return promise;
};

exports.models = function(params, context) {
    var promise = new no.Promise();

    // TODO: Need to have dedupe logic somewhere here. Or dedupe will happen
    // inside descript blocks?

    var models = Object.keys(params).reduce(function(acc, key) {
        var p = key.match(/^([A-Za-z0-9_@\/]+)\.([A-Za-z0-9_]+)$/);
        var componentKey = p[1];
        var paramName = p[2];

        if (!acc[componentKey]) {
            acc[componentKey] = {
                params: {}
            };
        }

        if (paramName === C.MODEL_ID_PARAM_NAME) {
            acc[componentKey].id = params[key];
        } else {
            acc[componentKey].params[paramName] = params[key];
        }

        return acc;
    }, {});

    var data = new de.Block.Object(
        Object.keys(models).reduce(function(acc, key) {
            var model = models[key];

            acc[key] = request(model.id, model.params);

            return acc;
        }, {}),
        {
            // FIXME: No idea how this line removes the nesting of
            // `result`, but it works.
            result: '.'
        }
    ).run(null, context);

    data.fail(function(error) {
        promise.reject(
            new de.Result.Error(error)
        );
    });

    data.done(function(data) {
        promise.resolve(
            new de.Result.Value(data.result)
        );
    });

    return promise;
};
