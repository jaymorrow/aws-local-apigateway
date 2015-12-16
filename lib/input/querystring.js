'use strict';

function mapQuerystring (integrationRequest, qs) {
    var requestQuerystring = integrationRequest.requestMap.querystring;
    var ret = {};

    Object.keys(requestQuerystring).forEach(function (key) {
        var val = qs[requestQuerystring[key][1]];

        if (typeof val !== 'undefined') {
            ret[key] = val;
        }
    });

    return ret;
}

module.exports = mapQuerystring;