function dispatch(action) {
    return this.props.dispatch({
        type: 'COMPONENT_ACTION',
        models: this.props.models,
        originalAction: action
    });
}

exports.dispatch = dispatch;
