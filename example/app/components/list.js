var qozon = require('qozon');
var React = require('react');
var Navigation = require('react-router').Navigation;
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
                return qozon.request('models/list', {
                    start: location.query.start
                });
            },
            title: function() {
                return qozon.request('models/list-title');
            }
        }
    },
    mixins: [Navigation],
    render: function() {
        return D.div(null,
            D.strong(null, this.props.title),
            ' ',
            link(
                { to: '/', query: { start: 2 } },
                'Increment'
            ),
            this.props.list.map(function(number) {
                return D.div({ key: number }, number);
            })
        );
    }
});

module.exports = qozon.connect(List);
