var computeDependencyKey = require('./compute-dep-key');

function extract(state) {
    return state.branch.reduce(function(acc, branch) {
        if (branch.components) {
            Object.keys(branch.components).forEach(function(key) {
                extractFromComponent(branch.components[key]);
            });
        } else if (branch.component) {
            extractFromComponent(branch.component);
        }

        return acc;

        function extractFromComponent(Component) {
            var C = Component.WrappedComponent || Component;
            var modelsDescriptor = C.models;

            if (modelsDescriptor) {
                Object.keys(modelsDescriptor).forEach(function(id) {
                    var block = modelsDescriptor[id](state.location);
                    var key = computeDependencyKey(C, id);

                    acc[key] = block;
                });
            }
        }
    }, {});
}

module.exports = extract;
