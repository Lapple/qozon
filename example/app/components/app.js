var React = require('react');
var D = React.DOM;

var App = React.createClass({
    render: function() {
        return D.div(null,
            D.h1(null, 'Example app'),
            this.props.header,
            this.props.content);
    }
});

module.exports = App;
