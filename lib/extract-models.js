var flatten = require('flatten');

var computeCacheKey = require('./compute-cache-key');
var computeDependencyKey = require('./compute-dep-key');

function extract(state) {
    var getModelsForLocation = getModels.bind(null, state.location);

    return flatten(
        state.branch
            .map(function(branch) {
                if (branch.components) {
                    return Object.keys(branch.components).map(function(key) {
                        return getModelsForLocation(branch.components[key]);
                    });
                } else if (branch.component) {
                    return getModelsForLocation(branch.component);
                } else {
                    return null;
                }
            })
    ).filter(function(m) {
        return m !== null;
    });
}

function getModels(location, Component) {
    var C = Component.WrappedComponent || Component;
    var modelDescriptors = C.models;

    if (modelDescriptors) {
        return Object.keys(modelDescriptors).map(function(id) {
            var modelDescriptor = modelDescriptors[id](location);

            return {
                componentKey: computeDependencyKey(C, id),
                modelKey: computeCacheKey(
                    modelDescriptor.id,
                    modelDescriptor.params
                ),
                descriptor: modelDescriptor
            };
        });
    } else {
        return null;
    }
}

module.exports = extract;
