var no = require('nommon');
var de = require('descript');

var C = require('../consts');
var request = require('../request');

function models(params, context) {
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
}

module.exports = models;
