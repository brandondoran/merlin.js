'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.checkConstructor = checkConstructor;
exports.mEscape = mEscape;
exports.mSearchSerialize = mSearchSerialize;
exports.set = set;
// Number.isNaN polyfill
Number.isNaN = Number.isNaN || function (value) {
  return typeof value === 'number' && value !== value;
};

// String.endsWith polyfill
if (!String.prototype.endsWith) {
  String.prototype.endsWith = function (searchString, position) {
    var subjectString = this.toString();
    if (position === undefined || position > subjectString.length) {
      position = subjectString.length;
    }
    position -= searchString.length;
    var lastIndex = subjectString.indexOf(searchString, position);
    return lastIndex !== -1 && lastIndex === position;
  };
}

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

function mEscape(str) {
  var escChar = '\\';
  var re = /(\!|\,|\||\\|\/)/g;
  var escaped = str.replace(re, function (a) {
    return '' + escChar + '' + a;
  });
  if (escaped.endsWith(escChar)) {
    throw new Error('' + str + ' contains a hanging escape-character (\\) at the end');
  }
  return escaped;
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