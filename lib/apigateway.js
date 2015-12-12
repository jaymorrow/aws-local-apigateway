'use strict';

var http = require('http');
var url = require('url');

var integration = require('./integration');
var mapping = require('./mapping');
var Velocity = require('./velocity');

var defaults = {
    // method: 'method.json',
    // methodResponse: 'method-response.json',
    integration: 'integration.json',
    // integrationResponse: 'integration-response.json',
    response: handleResponse,
    port: 8400
};

function ApiGateway(options) {
    if (!(this instanceof ApiGateway)) {
        return new ApiGateway(options);
    }

    this.server;
    options = options || {};
    defineProperties.call(this, options);
    return this;
}

ApiGateway.prototype.open = function(next) {
    if (this.server) {
        console.warn('Server already running at: http://localhost:%d"', this.port);
        return;
    }

    this.server = http.createServer(handleRequest.bind(this));

    this.server.on('close', function () {
        console.log('Closing mock API Gateway');
    });

    this.server.listen(this.port, function() {
        console.log("Started mock API Gateway listening on: http://localhost:%d", this.port);

        next && next(this.port, this.close.bind(this));
    }.bind(this));
};

ApiGateway.prototype.close = function(next) {
    if (!this.server) {
        console.warn('No active server');
        return;
    }

    next = next || function () {};
    this.server.close(next);
};

function matchingURL(uri, resource) {
    var urlParts = url.parse(resource).pathname.split('/');
    var uriParts = uri.split('/');

    if (urlParts.length !== uriParts.length) {
        return false;
    }

    return uriParts.every(function (part, index) {
        if (part.indexOf('{') === 0) {
            return true
        }

        return part === urlParts[index];
    });
}

function serverError(res, err) {
    res.statusCode = 500;
    res.end(err.toString());
}

function handleResponse(res, data) {
    res.statusCode = 200;
    res.end(JSON.stringify(data, null, 4));
}

function handleRequest(req, res) {
    var _this = this;

    if (req.url.match(/favicon\.ico/)) {
        return res.end();
    }

    var integrationRequest = this.integration && integration(this.integration);
    if (integrationRequest.httpMethod !== req.method || !matchingURL(integrationRequest.uri, req.url)) {
        res.statusCode = 400;
        return res.end('Bad request');
    }

    mapping(req, integrationRequest, function (err, map) {
        if (err) {
            return serverError(res, err);
        }

        try {
            var ev = JSON.parse(Velocity.render(integrationRequest.requestTemplates['application/json'], map));
        } catch (err) {
            return serverError(res, err);
        }

        var result = {
            requestMap: ev
        };

        _this.response(res, result);
    });
}

function defineProperties(options) {
    var _this = this;
    var val;
    var optVal;

    Object.keys(defaults).forEach(function(key) {
        optVal = options[key];
        val = optVal ? optVal === true ? defaults[key] : optVal : false;

        Object.defineProperty(_this, key, {
            __proto__: null,
            enumerable: true,
            value: val,
            writable: true
        });
    });
}


module.exports = ApiGateway;