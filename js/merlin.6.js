'use strict';

import request from 'superagent';

class Expression {
  constructor(options) {
    this.field = options.field;
    this.operator = options.operator;
    this.value = options.value;
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
      default: throw new Error('Invalid operator');
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
    this._tag = input;
    return this;
  }
  get tagString() {
    return `/tag=${this._tag}`;
  }
  toString() {
    let expressions = this.expressions.reduce((result, expression) => {
      return result + expression.toString();
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

class Facet {
  constructor(options) {
    this.field = options.field;
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

class Sort {
  constructor(options) {
    this.field = options.field;
    switch (options.ordering) {
      case 'asc':
      case 'desc': this.ordering = options.ordering; break;
      default: throw new Error('Invalid sort ordering');
    }
  }
  toString() {
    return `${this.field}:${this.ordering}`;
  }
}

class Request {
  constructor(options) {
    // todo: clean this up
    (this.q = options.q) || delete this.q;
    (this.start = options.start) || delete this.start;
    (this.num = options.num) || delete this.num;
    (this.fields = Request.handleFields(options.fields)) || delete this.fields;
    (this.facet = Request.handleFacetsAndFilters(options.facet)) || delete this.facet;
    (this.filter = Request.handleFacetsAndFilters(options.filter)) || delete this.filter;
    (this.sort = Request.handleSorts(options.sort)) || delete this.sort;

    if (!this.q) {
      throw new Error(`The 'q' parameter is required.`);
    }
  }
  static handleFields(input) {
    if(Array.isArray(input)) {
      return input.join(',');
    }
    return input;
  }
  static handleFacetsAndFilters(input) {
    if(Array.isArray(input)) {
      return input.map(Request.handleFacetsAndFilters);
    }
    if (input) {
      return input.toString();
    }
  }
  static handleSorts(input) {
    if(Array.isArray(input)) {
      return input.map((sort) => sort.toString()).join(',');
    }
    return input;
  }
}

class Engine {
  constructor(options) {
    this.protocol = options.protocol || 'https';
    this.company = options.company;
    this.environment = options.environment;
    this.instance = options.instance;

    if (!this.company) {
      throw new Error(`The 'company' parameter is required.`);
    }
    if (!this.environment) {
      throw new Error(`The 'environment' parameter is required.`);
    }
    if (!this.instance) {
      throw new Error(`The 'instance' parameter is required.`);
    }
  }
  get fq() {
    return `${this.company}.${this.environment}.${this.instance}`;
  }
  get cluster() {
    return `search-${this.environment}`;
  }
  get target() {
    return `${this.protocol}://${this.cluster}.search.blackbird.am/${this.fq}/search`;
  }
  search(req) {
    return request
    .get(this.target)
    .query(new Request(req));
  }
}

let Blackbird = {
  Engine,
  CnfFilter,
  DnfFilter,
  EnumFacet,
  HistFacet,
  RangeFacet,
  Request,
  Sort
};

export default Blackbird;

// todo: make this library browser compatible
