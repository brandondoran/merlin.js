'use strict';

import {checkConstructor, RE1} from './helpers';

class Sort {
  constructor(options) {
    let {field} = options;
    if (!field) {
      throw new Error('Sort#field is required.');
    }
    if (!checkConstructor(field, String)) {
      throw new Error('Sort#field must be a string.');
    }
    if (!RE1.test(field)) {
      throw new Error('Sort#field can only contain a-z, 0-9, and underscores, and must start with a lowercase letter.');
    }
    this.field = field;
  }
  toString(ordering) {
    return `${this.field}:${ordering}`;
  }
}

class AscSort extends Sort {
  toString() {
    return super.toString('asc');
  }
}

class DescSort extends Sort {
  toString() {
    return super.toString('desc');
  }
}

export function ascSort(options) {
  return new AscSort(options);
}

export function descSort(options) {
  return new DescSort(options);
}
