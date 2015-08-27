var App = require('./components/app');
var Header = require('./components/header');
var List = require('./components/list');
var Settings = require('./components/settings');

module.exports = {
    component: App,
    childRoutes: [
        {
            path: '/',
            components: {
                header: Header,
                content: List
            }
        },
        {
            path: '/settings',
            components: {
                header: Header,
                content: Settings
            }
        }
    ]
};
