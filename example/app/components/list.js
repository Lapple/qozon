var qozon = require('qozon');
var React = require('react');
var Link = require('react-router').Link;

var D = React.DOM;
var link = React.createFactory(Link);

var List = React.createClass({
    // FIXME: This is going to require a unique display name on each
    // connected component.
    displayName: 'List',
    statics: {
        models: {
            list: function(location) {
                return qozon.request('list', {
                    start: location.query.start
                });
            },
            title: function() {
                return qozon.request('list-title');
            }
        }
    },
    render: function() {
        if (this.props.loadingModels) {
            return D.span(null, 'Loading..');
        }

        var models = this.props.models;

        return D.div(null,
            D.strong(null, models.title),
            ' ',
            link(
                { to: '/', query: { start: 2 } },
                'Increment'
            ),
            models.list.map(function(number) {
                return D.div({ key: number }, number);
            })
        );
    }
});

module.exports = qozon.connect(List);
