var React = require('react');
var Navigation = require('react-router').Navigation;
var Link = require('react-router').Link;

var D = React.DOM;
var link = React.createFactory(Link);

var Header = React.createClass({
    mixins: [Navigation],
    render: function() {
        return D.div(null,
            D.h2(null, 'Header'),
            D.ul(null,
                D.li(null,
                    link(
                        { to: '/', query: { start: 1 } },
                        'Numbers'
                    )
                ),
                D.li(null,
                    link(
                        { to: '/settings' },
                        'Settings'
                    )
                )
            )
        );
    }
});

module.exports = Header;
