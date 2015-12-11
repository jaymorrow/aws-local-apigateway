'use strict';

var request = /^(method|integration)\.request\.(querystring|path|header)\.([\w\d-_\.\!~\*\'\(\)]+$)/;
var response = /^(method|integration)\.response\.header\.([\w\d-_\.\!~\*\'\(\)]+$)/;

var parameters = {};
var location;

function parseKey(param) {
    var key = param.match(request);

    if (key === null || key[1] !== 'integration') {
        throw new Error('Request key must match \'integration.request.{location}.{name}\' format.');
    }

    return {
        location: key[2],
        name: key[3]
    };
}

function parseVal(str) {
    if (str.indexOf("'") === 0) {
        if (str.lastIndexOf("'") !== str.length - 1) {
            throw new Error('Static values must be enclosed in single quotes (\'\')');
        }

        return str;
    }

    var val = str.match(request);
    if (val == null && val[1] !== 'method') {
        throw new Error('Request key must match \'method.request.{location}.{name}\' format.');
    }

    val = [val[2], val[3]];

    return val;
}

function mapIntegration(params) {
    Object.keys(params).forEach(function (param) {
        var key = parseKey(param);
        var val = parseVal(params[param]);

        var location = parameters[key.location] || (parameters[key.location] = {});
        location[key.name] = val;
    });

    return parameters;
}

module.exports = {
    integration: mapIntegration
};

