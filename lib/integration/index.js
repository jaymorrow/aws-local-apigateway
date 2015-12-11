'use strict';

var fs = require('fs');
var path = require('path');
var cwd = process.cwd();

var parameters = require('../utils/parameters');
var templates = require('../utils/templates');

module.exports = function integration(file) {
    var integrationPath = path.resolve(cwd, file);
    var integration = JSON.parse(fs.readFileSync(integrationPath, 'utf8'));

    integration.requestMap = parameters.integration(integration.requestParameters);
    integration.requestTemplates = templates(integration.requestTemplates, path.dirname(integrationPath));

    return integration;
};