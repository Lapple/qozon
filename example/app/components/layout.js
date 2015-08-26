var React = require('react');
var D = React.DOM;

module.exports = React.createClass({
    render: function() {
        return D.html(null,
            D.body(null,
                this.props.children,
                D.script({ src: '//localhost:2002/index.compiled.js' })
            )
        );
    }
});
