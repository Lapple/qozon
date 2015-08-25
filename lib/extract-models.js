var dependencyKey = require('./dependency-key');

function extract(state) {
    return state.branch.reduce(function(acc, branch) {
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
    }, {});
}

module.exports = extract;
