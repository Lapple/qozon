var redux = require('redux');

function baseReducer(next, state, action) {
    switch (action.type) {
        case 'POPULATE_MODELS':
            return {
                location: state.location,
                models: action.models
            };

        case 'SET_LOCATION':
            return {
                location: action.location,
                models: state.models
            };

        default:
            return next(state, action);
    }
}

function createStore(reducer) {
    return redux.createStore(
        baseReducer.bind(null, reducer),
        {}
    );
}

module.exports = createStore;
