'use strict';

import {checkConstructor, RE1} from './helpers';

class Facet {
  constructor(options) {
    let {field} = options;
    if (!checkConstructor(field, String)) {
      throw new Error('Facet#field must be a string.');
    }
    if (!RE1.test(field)) {
      throw new Error('Facet#field can only contain a-z, 0-9, and underscores, and must start with a lowercase letter.');
    }
    this.field = field;
  }
  toString() {
    return `field=${this.field}`;
  }
}

class EnumFacet extends Facet {
  constructor(options) {
    super(options);
    this.num = Number(options.num) || 0;
  }
  toString() {
    return `${super.toString()}/type=enum/num=${this.num}`;
  }
}

class HistFacet extends Facet {
  constructor(options) {
    super(options);
    this.start = Number(options.start) || 0;
    this.end = Number(options.end) || 0;
    this.gap = Number(options.gap) || 0;
  }
  get range() {
    return `[${this.start}:${this.end}:${this.gap}]`;
  }
  toString() {
    return `${super.toString()}/type=hist/range=${this.range()}`;
  }
}

class RangeFacet extends Facet {
  constructor(options) {
    super(options);
  }
  toString() {
    return `${super.toString()}/type=range`;
  }
}

export function enumFacet(options) {
  return new EnumFacet(options);
}

export function histFacet(options) {
  return new HistFacet(options);
}

export function rangeFacet(options) {
  return new RangeFacet(options);
}
