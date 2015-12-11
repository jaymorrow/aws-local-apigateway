'use strict';

var fs = require('fs');
var path = require('path');

var isPath = /\.(?:json|vm)$/;

function getTemplate(request, dir) {
    var templates = {};

    Object.keys(request).forEach(function(type) {
        var template = request[type];

        if (isPath.test(template)) {
            template = fs.readFileSync(path.resolve(dir, template), 'utf8');
        }

        templates[type] = template;
    });

    return templates;
}

module.exports = getTemplate;