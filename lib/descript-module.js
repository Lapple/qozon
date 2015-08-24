var assert = require('assert');

var no = require('nommon');
var de = require('descript');
var pff = require('pff');

var React = require('react');
var Router = require('react-router').Router;
var Location = require('react-router/lib/Location');
var Provider = require('react-redux').Provider;

var modelKey = require('../lib/model-key');

var router = React.createFactory(Router);
var provider = React.createFactory(Provider);

var EMPTY = [];

exports.render = function(params, context) {
    assert.equal(typeof params.routes, 'object', 'params.routes is missing');
    assert.equal(typeof params.store, 'object', 'params.store is missing');

    var promise = new no.Promise();

    var request = context.request;
    var location = new Location(request.url.pathname, request.url.query);

    var store = params.store;

    Router.run(params.routes, location, function(error, state) {
        if (error) {
            promise.reject(
                new de.Result.Value(error)
            );
        } else {
            var data = new de.Block.Object(
                state.branch.reduce(function(acc, branch) {
                    var Component = branch.component.WrappedComponent || branch.component;
                    var modelsDescriptor = Component.models;

                    if (modelsDescriptor) {
                        Object.keys(modelsDescriptor).forEach(function(id) {
                            var modelDescriptor = modelsDescriptor[id];
                            var modelId = modelDescriptor.id;
                            // FIXME: Need to validate
                            var filename = pff('./%s.jsx', modelId);

                            var params = modelDescriptor.params(state.location);
                            var key = modelKey(modelId, params);

                            acc[key] = new de.Block.Include(filename, {
                                params: function() {
                                    return params;
                                }
                            });
                        });
                    }

                    return acc;
                }, {}),
                {
                    result: '.'
                }
            ).run(null, context);

            data.fail(function(error) {
                promise.reject(
                    new de.Result.Value(error)
                );
            });

            data.done(function(data) {
                var models = data.result;

                store.dispatch({
                    type: 'SET_LOCATION',
                    location: state.location
                });

                store.dispatch({
                    type: 'POPULATE_MODELS',
                    models: models
                });

                promise.resolve(
                    new de.Result.HTML(
                        '<!doctype html>' +
                        React.renderToString(
                            provider({
                                store: store
                            }, function() {
                                return router(state);
                            })
                        ) +
                        '<script type="application/json">' +
                        JSON.stringify(models) +
                        '</script>'
                    )
                );
            });
        }
    });

    return promise;
};
