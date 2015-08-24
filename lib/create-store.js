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
    function create() {
        return redux.createStore(
            baseReducer.bind(null, reducer),
            {}
        );
    }

    // While it's convenient to have a singleton store in browser, on the server
    // every request has to create a separate store.
    if (process.browser) {
        return create();
    } else {
        return create
    }
}

module.exports = createStore;
