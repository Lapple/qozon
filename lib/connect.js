var connect = require('react-redux').connect;
var dependencyKey = require('./dependency-key');

function select(Component, state) {
    return Object.keys(Component.models).reduce(function(acc, id) {
        acc[id] = state.models[dependencyKey(Component, id)].data;

        return acc;
    }, {});
}

module.exports = function(Component) {
    if (!Component.models) {
        return Component;
    }

    return connect(select.bind(null, Component))(Component);
};
