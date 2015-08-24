var qozon = require('qozon');

var React = require('react');
var D = React.DOM;

var List = React.createClass({
    // FIXME: This is going to require a unique display name on each
    // connected component.
    displayName: 'List',
    statics: {
        models: {
            list: function(location) {
                return qozon.request('models/list', {
                    start: Number(location.query.start)
                });
            }
        }
    },
    render: function() {
        return D.div(null,
            D.strong(null, 'List of numbers'),
            this.props.list.map(function(number) {
                return D.div({ key: number }, number);
            })
        );
    }
});

module.exports = qozon.connect(List);
