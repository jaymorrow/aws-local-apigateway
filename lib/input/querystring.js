'use strict';

function mapQuerystring (integrationRequest, qs) {
    var requestQuerystring = integrationRequest.requestMap.querystring;
    var ret = {};

    Object.keys(requestQuerystring).forEach(function (key) {
        ret[key] = qs[requestQuerystring[key][1]];
    });

    return ret;
}

module.exports = mapQuerystring;