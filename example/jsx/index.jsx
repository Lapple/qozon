(
    de.call('qozon:render()', {
        params: function() {
            return {
                routes: require('../app/routes'),
                store: require('../app/store')
            };
        }
    })
)
