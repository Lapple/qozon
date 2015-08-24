var App = require('./components/app');
var List = require('./components/list');

module.exports = {
    component: App,
    childRoutes: [
        {
            path: '/',
            component: List
        }
    ]
};
