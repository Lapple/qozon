var connect = require('qozon').connect;

var React = require('react');
var D = React.DOM;

var List = React.createClass({
    statics: {
        models: {
            list: {
                id: 'models/list',
                params: function(location) {
                    return {
                        start: Number(location.query.start)
                    };
                }
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

module.exports = connect(List);
