var assert = require('assert');

var no = require('nommon');
var de = require('descript');

var React = require('react');
var Router = require('react-router').Router;
var Location = require('react-router/lib/Location');
var renderToString = require('react-dom/server').renderToString;
var renderToStaticMarkup = require('react-dom/server').renderToStaticMarkup;

var C = require('../consts');
var extractModels = require('../extract-models');
var rootComponent = require('../root-component');

function render(params, context) {
    assert.equal(typeof params.routes, 'object', 'params.routes is missing');
    assert.equal(typeof params.store, 'function', 'params.store is missing');

    var promise = new no.Promise();

    var request = context.request;
    var location = new Location(request.url.pathname, request.url.query);

    var store = params.store();
    var layout = React.createFactory(params.layout);

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
                        '<!doctype html>' +
                        renderToStaticMarkup(
                            layout(null,
                                // FIXME: Two `render` calls are necessary
                                // to maintain same keypath of the root
                                // component between browser and server.
                                React.DOM.div({
                                    id: C.APP_CONTAINER_ID,
                                    dangerouslySetInnerHTML: {
                                        __html: renderToString(
                                            rootComponent(store, state)
                                        )
                                    }
                                }),
                                React.DOM.script({
                                    id: C.MODELS_CONTAINER_ID,
                                    type: 'application/json',
                                    dangerouslySetInnerHTML: {
                                        // FIXME: Escape.
                                        __html: JSON.stringify(models)
                                    }
                                })
                            )
                        )
                    )
                );
            });
        }
    });

    return promise;
}

module.exports = render;
