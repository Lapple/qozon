(
    de.object({
        defaultProfileId: de.include('models/profiles.jsx', {
            state: {
                profiles: '.'
            },
            guard: function(params) {
                return !params.id;
            }
        }) +10,
        settings: function(params, context) {
            var id = params.id || context.state.profiles[0].id;

            if (id === 'user') {
                return {
                    subscribe: true
                };
            }

            if (id === 'common') {
                return {
                    subscribe: false
                };
            }
        }
    }, {
        result: '.settings'
    })
)
