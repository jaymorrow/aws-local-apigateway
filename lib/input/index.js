'use strict';

var url = require('url');
var qs = require('querystring');

var resource = require('./resource');
var querystring = require('./querystring');
var headers = require('./headers');
var body = require('./body');

function hasBody (method) {
    return ['POST', 'PUT', 'PATCH', 'DELETE'].indexOf(method) > -1;
}

function input(integrationRequest, request, next) {
    var input = {};
    input.params = {};

    var params = input.params;
    params.path = resource(integrationRequest, url.parse(request.url).pathname);
    params.querystring = querystring(integrationRequest, url.parse(request.url, true).query);
    params.header = headers(request);

    if (hasBody(request.method)) {
        input.body = {};

        body(request, function (err, postBody) {
            input.body = postBody;
            next(err, input);
        });
    } else {
        next(null, input);
    }
}

module.exports = input;