var pff = require('pff');

function key(Component, id) {
    return pff('%s@%s', Component.displayName, id);
}

module.exports = key;
