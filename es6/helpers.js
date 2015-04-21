'use strict';

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
