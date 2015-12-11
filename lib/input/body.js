'use strict';

var qs = require('querystring');

function getBody(request, next) {
    var body = '';

    request.on('data', function (data) {
        body += data;
    });

    request.on('end', function () {
        try {
            var post = JSON.parse(body);
        } catch (err) {
            err.message = "Could not parse request body into json";
            return next(err);
        }

        next(null, post);
    });
}

module.exports = getBody;
