var stringify = require('querystring').stringify;
var pff = require('pff');

function computeKey(id, params) {
    return pff(
        '%s?%s',
        id,
        stringify(params)
    );
}

module.exports = computeKey;
