var qozon = require('qozon');
var React = require('react');
var Link = require('react-router').Link;

var D = React.DOM;
var link = React.createFactory(Link);

var Settings = React.createClass({
    displayName: 'Settings',
    statics: {
        models: {
            profiles: function() {
                return qozon.request('profiles');
            },
            profileSettings: function(location) {
                return qozon.request('profile-settings', {
                    id: location.query && location.query.profile
                });
            }
        }
    },
    // FIXME: This could probably happen inside `connect` call.
    mixins: [qozon.DispatchMixin],
    _onSubscriptionChange: function(e) {
        this.dispatch({
            type: 'CHANGE_SUBSCRIPTION',
            isSubscribed: e.target.checked
        });
    },
    render: function() {
        if (this.props.loadingModels) {
            return D.span(null, 'Loading..');
        }

        var models = this.props.models;

        return D.div(null,
            D.h2(null, 'Settings'),
            models.profiles.map(function(p) {
                return D.div({ key: p.id },
                    link(
                        { to: '/settings', query: { profile: p.id } },
                        p.name
                    )
                );
            }),
            D.hr(),
            D.label(null,
                D.input({
                    type: 'checkbox',
                    checked: models.profileSettings.subscribe,
                    onChange: this._onSubscriptionChange
                }),
                'Receive notifications'
            )
        );
    }
});

module.exports = qozon.connect(Settings);
