var assert = require('assert');

var de = require('descript');
var pff = require('pff');

function request(params, context) {
    assert.equal(typeof params.id, 'string');
    assert.equal(params.id.indexOf('..'), -1, 'can\'t fetch models outside of models/ directory');

    var filename = pff('./models/%s.jsx', params.id);

    var block = new de.Block.Include(filename, {
        params: function() {
            return params.params;
        }
    });

    return block.run(params, context);
}

module.exports = request;
