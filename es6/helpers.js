'use strict';

// Number.isNaN polyfill
Number.isNaN = Number.isNaN || function(value) {
  return typeof value === 'number' && value !== value;
};

// String.endsWith polyfill
if (!String.prototype.endsWith) {
  String.prototype.endsWith = function(searchString, position) {
    var subjectString = this.toString();
    if (position === undefined || position > subjectString.length) {
      position = subjectString.length;
    }
    position -= searchString.length;
    var lastIndex = subjectString.indexOf(searchString, position);
    return lastIndex !== -1 && lastIndex === position;
  };
}

export const _ = {
  isUndefined(val) {
    return val === undefined;
  },
  isNull(val) {
    return val === null;
  },
  isNaN(val) {
    return Number.isNaN(val);
  }
};

export const RE1 = /^_?[a-z][0-9a-z_]{0,63}$/;
export const RE2 = /(\w+)\.(prod|staging|dev)\.(\w+)/;

export function checkConstructor(input, ...constructors) {
  return constructors.reduce((result, constructor) => {
    return result || input.constructor === constructor;
  }, false);
}

// borrowed from superagent
function isObject(obj) {
  return obj === Object(obj);
}

export function mEscape(str) {
  const escChar = '\\';
  const re = /(\!|\,|\||\\|\/)/g;
  const escaped = str.replace(re, a => `${escChar}${a}`);
  if (escaped.endsWith(escChar)) {
    throw new Error(`${str} contains a hanging escape-character (\\) at the end`);
  }
  return escaped;
}

export function mSearchSerialize(obj) {
  if (!isObject(obj)) { return obj; }
  var pairs = [];
  for (var key in obj) {
    if (obj[key] != null) {
      pairs.push(encodeURIComponent(key)
        + '=' + encodeURIComponent(obj[key]));
    }
  }
  return pairs.join('//');
}

export function set(obj, k, v) {
  const isundef = _.isUndefined(v);
  const isnull = _.isNull(v);
  const isnan = _.isNaN(v);
  if (!isundef && !isnull && !isnan) {
    obj[k] = v;
  }
  return obj[k];
}
