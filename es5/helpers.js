'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.checkConstructor = checkConstructor;
exports.mSearchSerialize = mSearchSerialize;
exports.set = set;
'use strict';

var _ = {
  isUndefined: function isUndefined(val) {
    return val === undefined;
  },
  isNull: function isNull(val) {
    return val === null;
  },
  isNaN: function isNaN(val) {
    return Number.isNaN(val);
  }
};

exports._ = _;
var RE1 = /^_?[a-z][0-9a-z_]{0,63}$/;
exports.RE1 = RE1;
var RE2 = /(\w+)\.(prod|staging|dev)\.(\w+)/;

exports.RE2 = RE2;

function checkConstructor(input) {
  for (var _len = arguments.length, constructors = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    constructors[_key - 1] = arguments[_key];
  }

  return constructors.reduce(function (result, constructor) {
    return result || input.constructor === constructor;
  }, false);
}

// borrowed from superagent
function isObject(obj) {
  return obj === Object(obj);
}

function mSearchSerialize(obj) {
  if (!isObject(obj)) {
    return obj;
  }
  var pairs = [];
  for (var key in obj) {
    if (obj[key] != null) {
      pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
    }
  }
  return pairs.join('//');
}

function set(obj, k, v) {
  var isundef = _.isUndefined(v);
  var isnull = _.isNull(v);
  var isnan = _.isNaN(v);
  if (!isundef && !isnull && !isnan) {
    obj[k] = v;
  }
  return obj[k];
}