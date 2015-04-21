'use strict';

import {checkConstructor, RE1} from './helpers';
import {expression, andExpression, orExpression} from './expression';

class Filter {
  constructor(options) {
    this.expressions = [];
    this.expressions.push(expression(options));
  }
  and(options) {
    this.expressions.push(andExpression(options));
    return this;
  }
  or(options) {
    this.expressions.push(orExpression(options));
    return this;
  }
  tag(input) {
    if (!checkConstructor(input, String)) {
      throw new Error('Filter tags must be strings.');
    }
    if (!RE1.test(input)) {
      throw new Error('Filter tags can only contain a-z, 0-9, and underscores, and must start with a lowercase letter.');
    }
    this._tag = input;
    return this;
  }
  get tagString() {
    if (this._tag) {
      return `/tag=${this._tag}`;
    }
    return '';
  }
  toString() {
    let expressions = this.expressions.reduce((result, exp) => {
      return result + exp.toString();
    }, '');

    return `exp=${expressions}${this.tagString}`;
  }
}

class CnfFilter extends Filter {
  constructor(options) {
    super(options);
  }
  toString() {
    return `${super.toString()}/type=cnf`;
  }
}

class DnfFilter extends Filter {
  constructor(options) {
    super(options);
  }
  toString() {
    return `${super.toString()}/type=dnf`;
  }
}

export function cnfFilter(options) {
  return new CnfFilter(options);
}

export function dnfFilter(options) {
  return new DnfFilter(options);
}
