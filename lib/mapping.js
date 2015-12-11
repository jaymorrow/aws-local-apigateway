'use strict';

var context = require('./context');
var input = require('./input');

function mapping(request, integrationRequest, next) {
    var ret = {};

    ret.context = context(request);

    Object.defineProperty(ret, 'util', {
        __proto__: null,
        value: {}
    });

    input(integrationRequest, request, function (err, data) {
        if (err) {
            return next(err);
        }

        ret.input = data;
        next(null, ret);
    });
}

module.exports = mapping;