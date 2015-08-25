var assert = require('assert');

var de = require('descript');
var pff = require('pff');

var modelKey = require('../model-key');

function request(id, params) {
    assert.equal(typeof id, 'string');
    assert.equal(id.indexOf('..'), -1, 'fetching models outside of rootdir is not allowed');

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
