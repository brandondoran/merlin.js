'use strict';

import {checkConstructor, RE1} from './helpers';

class Expression {
  constructor(options) {
    let {field, operator, value} = options;
    if (!field) {
      throw new Error('Expression#field is required.');
    }
    if (!operator) {
      throw new Error('Expression#operator is required.');
    }
    if (!value) {
      throw new Error('Expression#value is required.');
    }
    if (!checkConstructor(field, String)) {
      throw new Error('Expression#field must be a string.');
    }
    if (!RE1.test(field)) {
      throw new Error('Expression#field can only contain a-z, 0-9, and underscores, and must start with a lowercase letter.');
    }
    if (!checkConstructor(value, String, Number)) {
      throw new Error('Expression#value must be a string or a number.');
    }
    this.field = field;
    this.operator = operator;
    this.value = value;
  }
  toString() {
    let rhs, op = this.operator, val = this.value;
    switch (op) {
      case '=': rhs = `${val}`; break;
      case '!=': rhs = `!${val}`; break;
      case '<': rhs = `(:${val})`; break;
      case '>': rhs = `(${val}:)`; break;
      case '<=': rhs = `(:${val}]`; break;
      case '>=': rhs = `[${val}:)`; break;
      default: throw new Error('Expression#operator must be one of the following: =, !=, <, >, <=, or >=.');
    }
    return `${this.field}:${rhs}`;
  }
}

class AndExpression extends Expression {
  constructor(options) {
    super(options);
  }
  toString() {
    return `,${super.toString()}`;
  }
}

class OrExpression extends Expression {
  constructor(options) {
    super(options);
  }
  toString() {
    return `|${super.toString()}`;
  }
}

export function expression(options) {
  return new Expression(options);
}

export function andExpression(options) {
  return new AndExpression(options);
}

export function orExpression(options) {
  return new OrExpression(options);
}
