var connect = require('react-redux').connect;
var computeDependencyKey = require('../lib/compute-dep-key');

function select(Component, state) {
    return Object.keys(Component.models).reduce(function(acc, id) {
        acc[id] = state.models[computeDependencyKey(Component, id)].data;

        return acc;
    }, {});
}

module.exports = function(Component) {
    if (!Component.models) {
        return Component;
    }

    return connect(select.bind(null, Component))(Component);
};
