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

class Filter {
  constructor(options) {
    this.expressions = [];
    this.expressions.push(new Expression(options));
  }
  and(options) {
    this.expressions.push(new AndExpression(options));
    return this;
  }
  or(options) {
    this.expressions.push(new OrExpression(options));
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
    let expressions = this.expressions.reduce((result, expression) => {
      return result + expression.toString();
    }, '');

    return `exp=${expressions}${this.tagString}`;
  }
}

export class CnfFilter extends Filter {
  constructor(options) {
    super(options);
  }
  toString() {
    return `${super.toString()}/type=cnf`;
  }
}

export class DnfFilter extends Filter {
  constructor(options) {
    super(options);
  }
  toString() {
    return `${super.toString()}/type=dnf`;
  }
}
