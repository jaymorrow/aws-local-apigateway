'use strict';

var crypto = require('crypto');

module.exports = function random (size, alpha) {
    size = size || 11;
    var chars = alpha ? 'abcdefghijalmnopqrstuvwxys0123456789' : '0123456789';
    var rnd = crypto.randomBytes(size);
    var value = new Array(size);
    var len = chars.length;

    for (var i = 0; i < size; i++) {
        value[i] = chars[rnd[i] % len]
    };

    return value.join('');
};