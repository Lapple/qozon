var extend = require('extend');
var createStore = require('qozon').createStore;

function reducer(state, action) {
    switch (action.type) {
        case 'CHANGE_SUBSCRIPTION':
            // TODO: Call `do_model`.
            return update(action.models.profileSettings, function(settings) {
                return extend(settings, {
                    subscribe: action.isSubscribed
                });
            });

        default:
            return state;
    }

    // TODO: This can be moved into framework.
    function update(data, callback) {
        var updated = callback(data);

        return {
            cache: updateIn(state.cache, data, updated, 1),
            models: updateIn(state.models, data, updated, 2)
        };
    }

    function updateIn(object, a, b, depth) {
        if (depth === 0) {
            return object;
        }

        return Object.keys(object).reduce(function(acc, key) {
            var value = object[key];

            if (value === a) {
                acc[key] = b;
            } else {
                acc[key] = updateIn(value, a, b, depth - 1);
            }

            return acc;
        }, {});
    }
}

module.exports = createStore(reducer);
