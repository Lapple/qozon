var stringify = require('querystring').stringify;
var pff = require('pff');

var C = require('./consts');

function ModelsRequest() {
    var xhr = new XMLHttpRequest();

    this.descriptors = [];

    this.promise = new Promise(function(resolve, reject) {
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    resolve(
                        JSON.parse(xhr.responseText)
                    );
                } else {
                    reject(xhr.status);
                }
            }
        };
    });

    this.xhr = xhr;
}

ModelsRequest.prototype.add = function(modelDescriptor) {
    this.descriptors.push(modelDescriptor);

    return this.promise;
};

ModelsRequest.prototype.send = function() {
    var xhr = this.xhr;

    // TODO: Dedupe descriptors.

    if (this.descriptors.length === 0) {
        xhr.abort();
        return;
    }

    // FIXME: The part with having to put `models.jsx` file into application
    // folder while the pathname hardcoded here needs to have some thought.
    xhr.open('POST', '/models.jsx', true);

    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send(
        stringify(
            this.descriptors.reduce(function(acc, descriptor, index) {
                var params = descriptor.params;

                acc[paramName(C.MODEL_ID_PARAM_NAME)] = descriptor.id;

                if (params) {
                    Object.keys(params).forEach(function(k) {
                        acc[paramName(k)] = params[k];
                    });
                }

                return acc;

                function paramName(name) {
                    return pff('%s.%s', name, index);
                }
            }, {})
        )
    );
};

module.exports = ModelsRequest;
