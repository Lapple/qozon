var assert = require('assert');

var no = require('nommon');
var de = require('descript');

var React = require('react');
var Router = require('react-router').Router;
var Location = require('react-router/lib/Location');
var Provider = require('react-redux').Provider;

var router = React.createFactory(Router);
var provider = React.createFactory(Provider);

var dependencyKey = require('./dependency-key');

var EMPTY = [];

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
                state.branch.reduce(function(acc, branch) {
                    var Component = branch.component.WrappedComponent || branch.component;
                    var modelsDescriptor = Component.models;

                    if (modelsDescriptor) {
                        Object.keys(modelsDescriptor).forEach(function(id) {
                            var block = modelsDescriptor[id](state.location);
                            var key = dependencyKey(Component, id);

                            acc[key] = block;
                        });
                    }

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
                        React.renderToString(
                            provider({
                                store: store
                            }, function() {
                                return router(state);
                            })
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
