'use strict';

var url = require('url');
var re = /(^[a-z]|-[a-z])/g;

function toUpperCase(match, ch) {
 return ch.toUpperCase();
}

function mapHeaders(req) {
    var obj = {};

    Object.keys(req.headers).forEach(function (header) {
        var upper = header.replace(re, toUpperCase);
        obj[upper] = req.headers[header];
    });

    obj['X-Forwarded-For'] = '127.0.0.1';
    obj['X-Forwarded-Port'] = req.headers.host.split(':')[1];
    obj['X-Forwarded-Proto'] = 'http'; // TODO: Make proto real

    delete obj.Host;
    delete obj.Connection;

    if (obj['Postman-Token']) {
        delete obj['Postman-Token'];
    }

    return obj;
}

module.exports = mapHeaders;

/*
TODO: Implement remaining headers

CloudFront-Forwarded-Proto=https,
CloudFront-Is-Desktop-Viewer=true,
CloudFront-Is-Mobile-Viewer=false,
CloudFront-Is-SmartTV-Viewer=false,
CloudFront-Is-Tablet-Viewer=false,
CloudFront-Viewer-Country=US, DNT=1,
Referer=https://us-west-2.console.aws.amazon.com/apigateway/home?region=us-west-2,
Upgrade-Insecure-Requests=1,
Via=1.1 bf3998e9f35c898ce10f097aecebedfd.cloudfront.net (CloudFront),
X-Amz-Cf-Id=AGGqZBAcnX4azbD7eElb04bEDnrHONA_uW-2JCTHuwNLMkycH1SUyg==,
*/