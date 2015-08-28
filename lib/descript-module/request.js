var de = require('descript');
var pff = require('pff');

function request(params, context) {
    var filename = pff('./%s.jsx', params.id);

    var block = new de.Block.Include(filename, {
        params: function() {
            return params.params;
        }
    });

    return block.run(params, context);
}

module.exports = request;
