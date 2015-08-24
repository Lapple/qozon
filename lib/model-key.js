var stringify = require('querystring').stringify;
var pff = require('pff');

function key(id, params) {
    return pff(
        '%s&%s',
        stringify({
            __model__: id
        }),
        stringify(params)
    );
};

module.exports = key;
