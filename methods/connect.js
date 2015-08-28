var connect = require('react-redux').connect;
var computeDependencyKey = require('../lib/compute-dep-key');

function select(Component, state) {
    return Object.keys(Component.models).reduce(function(acc, id) {
        var key = computeDependencyKey(Component, id);

        if (state.models[key]) {
            acc.models[id] = state.models[key].data;
        } else {
            acc.loadingModels = true;
        }

        return acc;
    }, {
        models: {},
        loadingModels: false
    });
}

module.exports = function(Component) {
    if (!Component.models) {
        return Component;
    }

    return connect(select.bind(null, Component))(Component);
};
