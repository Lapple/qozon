var no = require('nommon');
var de = require('descript');
var pff = require('pff');

var C = require('../consts');
var computeCacheKey = require('../compute-cache-key');

function models(params, context) {
    var promise = new no.Promise();

    // TODO: Need to have dedupe logic somewhere here. Or dedupe will happen
    // inside descript blocks?

    var models = Object.keys(params).reduce(function(acc, key) {
        var p = key.match(/^([A-Za-z0-9_@\/]+)\.(\d+)$/);
        var paramName = p[1];
        var index = Number(p[2]);

        if (!acc[index]) {
            acc[index] = {
                params: {}
            };
        }

        if (paramName === C.MODEL_ID_PARAM_NAME) {
            acc[index].id = params[key];
        } else {
            acc[index].params[paramName] = params[key];
        }

        return acc;
    }, []);

    var data = new de.Block.Object(
        models.reduce(function(acc, model) {
            var key = computeCacheKey(model.id, model.params);

            acc[key] = new de.Block.Call('qozon:request()', {
                params: function() {
                    return model;
                }
            });

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
