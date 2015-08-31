var extend = require('extend');
var createStore = require('qozon').createStore;

function reducer(update, models, action) {
    switch (action.type) {
        case 'CHANGE_SUBSCRIPTION':
            // TODO: Call `do_model`.
            return update(models.profileSettings, function(settings) {
                return extend(settings, {
                    subscribe: action.isSubscribed
                });
            });
    }
}

module.exports = createStore(reducer);
