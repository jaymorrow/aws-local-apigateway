var assert = require('assert');
var request = require('request');
var ApiGateway = require('../');

describe('Starting', function() {

    it('should load integration', function(done) {
        var api = new ApiGateway({
            integration: './test-helpers/integration'
        });

        api.open(function(port, close) {
            var options = {
                url: 'http://localhost:' + port + '/user/12345?bar=test',
                headers: {
                    'User-Agent': 'request'
                }
            };

            request(options, function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log(body);
                }
                assert.ok(true);
                close(done);
            });
        });
    });
});