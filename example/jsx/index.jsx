(
    de.call('qozon:render()', {
        params: function() {
            return {
                routes: require('../app'),
                store: require('../app/store')
            };
        }
    })
)
