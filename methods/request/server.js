var assert = require('assert');

var de = require('descript');
var pff = require('pff');

var computeCacheKey = require('../../lib/compute-cache-key');

function request(id, params) {
    assert.equal(typeof id, 'string');
    // FIXME: Actually, should somehow disallow making includes outside of
    // `/models` directory.
    assert.equal(id.indexOf('..'), -1, 'fetching models outside of rootdir is not allowed');

    var filename = pff('./%s.jsx', id);

    return {
        key: computeCacheKey(id, params),
        data: new de.Block.Include(filename, {
            params: function() {
                return params;
            }
        })
    };
}

module.exports = request;
