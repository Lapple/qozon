var extend = require('extend');

function dispatch(payload) {
    return this.props.dispatch(
        extend({ models: this.props.models }, payload)
    );
}

exports.dispatch = dispatch;
