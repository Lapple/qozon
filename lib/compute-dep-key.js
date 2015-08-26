var pff = require('pff');

function computeKey(Component, id) {
    return pff('%s@%s', Component.displayName, id);
}

module.exports = computeKey;
