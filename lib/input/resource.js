'use strict';

var requestParam = /\{([\w\d-_\.\!~\*\'\(\)]+)\}/g;

function mapResource (integrationRequest, resource) {
    var pattern = integrationRequest.uri.split('/');
    var pathname = resource.split('/');
    var requestMapPath = integrationRequest.requestMap.path;
    var ret = {};
    var obj = {};

    if (pattern.length) {
        pattern.forEach(function (item, index) {
            if (item.indexOf('{') > -1 && pathname[index]) {
                var param = item.replace(requestParam, '$1');
                obj[param] = pathname[index];
            }
        });
    }

    Object.keys(requestMapPath).forEach(function (key) {
        ret[key] = obj[requestMapPath[key][1]] || '';
    });

    return ret;
}

module.exports = mapResource;