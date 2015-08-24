var de = require('descript');
var pff = require('pff');

var modelKey = require('../model-key');

function request(id, params) {
    // FIXME: Need to validate
    var filename = pff('./%s.jsx', id);

    return {
        key: modelKey(id, params),
        data: new de.Block.Include(filename, {
            params: function() {
                return params;
            }
        })
    };
}

module.exports = request;
