var connect = require('react-redux').connect;
var modelKey = require('./model-key');

function select(Component, state) {
    if (!Component.models) {
        return null;
    }

    return Object.keys(Component.models).reduce(function(acc, id) {
        var modelDescriptor = Component.models[id];

        var key = modelKey(
            modelDescriptor.id,
            modelDescriptor.params(state.location)
        );

        acc[id] = state.models[key];

        return acc;
    }, {});
}

module.exports = function(Component) {
    return connect(select.bind(null, Component))(Component);
};
