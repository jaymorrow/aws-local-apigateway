var jsonPath = require('JSONPath');
var Velocity = require('velocityjs');
var Compile = Velocity.Compile;

function stringify(params) {
    var str = Object.keys(params).map(function(item) {
        var val = params[item];
        if (typeof val === 'object') {
            return stringify(val);
        }

        return item + '=' + (val || '{}');
    });

    return '{' + str.join(', ') + '}';
}

function getter(base, property) {
    // get(1)
    if (typeof property === 'number') {
        return base[property];
    }

    var letter = property.charCodeAt(0);
    var isUpper = letter < 91;
    var ret = base[property];

    if (ret !== undefined) {
        return ret;
    }

    if (isUpper) {
        // Address => address
        property = String.fromCharCode(letter).toLowerCase() + property.slice(1);
    }

    if (!isUpper) {
        // address => Address
        property = String.fromCharCode(letter).toUpperCase() + property.slice(1);
    }

    return base[property];
}


var getRefs = Compile.prototype.getReferences;
Compile.prototype.getReferences = function(ast, isVal) {
    var ret = getRefs.apply(this, arguments);

    if (Array.isArray(ret) && isVal) {
        ret = '[' + ret.join(', ') + ']';
    } else if (typeof ret === 'object' && isVal) {
        ret = stringify(ret);
    }

    return ret;
}

var getProps = Compile.prototype.getPropMethod;
var props = ['path', 'querystring', 'header'];
Compile.prototype.getPropMethod = function(property, baseRef, ast) {
    var id = property.id;
    var args = property.args;
    var ret = '';

    if (id.indexOf('base64Encode') === 0) {
        if (!args) {
            return '';
        }

        try {
            ret = this.getLiteral(args[0]);
        } catch (e) {
            ret = args[0].value;
        }

        ast.prue = false;
        return new Buffer(ret).toString('base64');
    } else if (id.indexOf('base64Decode') === 0) {
        if (!args) {
            return '';
        }

        ast.prue = false;
        return new Buffer(args[0].value, 'base64').toString();
    } else if (id.indexOf('escapeJavaScript') === 0) {
        if (!args) {
            return '';
        }

        try {
            ret = this.getLiteral(args[0]);
        } catch (e) {
            ret = args[0].value;
        }

        ast.prue = false;
        return encodeURIComponent(ret);
    } else if (id.indexOf('urlEncode') === 0) {
        if (!args) {
            return '';
        }

        try {
            ret = this.getLiteral(args[0]);
        } catch (e) {
            ret = args[0].value;
        }

        ast.prue = false;
        return  encodeURIComponent(ret)
            .replace(/!/g, '%21')
            .replace(/'/g, '%27')
            .replace(/\(/g, '%28')
            .replace(/\)/g, '%29')
            .replace(/\*/g, '%2A')
            .replace(/%20/g, '+');
    } else if (id.indexOf('urlDecode') === 0) {
        if (!args) {
            return '';
        }

        ret = args[0].value.replace(/\+/g,  " ");
        ast.prue = false;

        return decodeURIComponent(ret);
    } else if (id.indexOf('params') === 0) {
        if (!args) {
            return baseRef.params;
        }

        var name = args[0].value;
        if (props.indexOf(name) > -1) {
            ret = getter(baseRef.params, this.getLiteral(args[0]));
        } else {
            ret = baseRef.params['path'][name] ||
                baseRef.params['querystring'][name] ||
                baseRef.params['header'][name] || '';
        }

        return ret;
    } else if (id.indexOf('json') === 0 || id.indexOf('path') === 0) {
        if (!args || args[0].value === '$') {
            ret = baseRef.body;
        } else {
            try {
                ret = jsonPath.eval(baseRef.body, args[0].value);
            } catch (err) {
                throw err;
            }
        }

        if (ret.length === 1) {
            ret = ret[0];
        }

        if (id.indexOf('json') === 0) {
            ret = JSON.stringify(ret);
        }

        return ret;
    }

    return getProps.apply(this, arguments);
}

module.exports = Velocity;
