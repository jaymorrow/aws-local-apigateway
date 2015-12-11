'use strict';

var url = require('url');
var uuid = require('uuid').v1;
var random = require('./random');

// Will only generate values once because of
// require caching, this is intentional.
var accountId = '1' + random();
var apiId = random(10, true);
var resourceId = random(10, true);
var apiKey = random(20, true).toUpperCase();

function context(request) {
    return {
        apiId: apiId,
        httpMethod: request.method,
        identity: {
            apiKey: apiKey,
            accountId: accountId,
            caller: '', // TODO: Simulate 'caller'
            sourceIp: '127.0.0.1',
            user: '', // TODO: Simulate 'user'
            userAgent: request.headers['user-agent'],
            userArn: '' // TODO: Simulate 'userArn'
        },
        requestId: uuid(),
        resourceId: resourceId,
        resourcePath: url.parse(request.url).pathname,
        stage: 'local'
    };
}

module.exports = context;