'use strict';

import request from 'superagent';

const RE1 = /^_?[a-z][0-9a-z_]{0,63}$/;

function checkConstructor(input, ...constructors) {
  return constructors.reduce((result, constructor) => {
    return result || input.constructor === constructor;
  }, false);
}

// borrowed from superagent
function isObject(obj) {
  return obj === Object(obj);
}

function mSearchSerialize(obj) {
  if (!isObject(obj)) return obj;
  var pairs = [];
  for (var key in obj) {
    if (null != obj[key]) {
      pairs.push(encodeURIComponent(key)
        + '=' + encodeURIComponent(obj[key]));
    }
  }
  return pairs.join('//');
}

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

class Request {
  constructor(options) {
    // todo: clean this up
    (this.start = Number(options.start)) || delete this.start;
    (this.num = Number(options.num)) || delete this.num;
    (this.sort = Request.handleSorts(options.sort)) || delete this.sort;
  }
  static handleSorts(input) {
    if(Array.isArray(input)) {
      return input.map((sort) => sort.toString()).join(',');
    }
    return input;
  }
}

class SearchRequest extends Request {
  constructor(options) {
    super(options);
    (this.q = options.q) || delete this.q;
    (this.fields = SearchRequest.handleFields(options.fields)) || delete this.fields;
    (this.facet = SearchRequest.handleFacetsAndFilters(options.facet)) || delete this.facet;
    (this.filter = SearchRequest.handleFacetsAndFilters(options.filter)) || delete this.filter;
    if (!this.q) {
      throw new Error(`The 'q' parameter is required.`);
    }
    if (!checkConstructor(this.q, String)) {
      throw new Error('Request#q must be a string.');
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
      return input.map(SearchRequest.handleFacetsAndFilters);
    }
    if (input) {
      return input.toString();
    }
  }
}

class QueryComponent {
  constructor(options) {
    (this.q = options.q) || delete this.q;
    (this.filter = SearchRequest.handleFacetsAndFilters(options.filter)) || delete this.filter;
  }
}

class MultiSearchRequest extends Request {
  constructor(options) {
    super(options);
    let {qc} = options;
    if (qc.length >= 6) {
      throw new Error('A multi-search only supports up to 6 queries.');
    }
    (this.qc = MultiSearchRequest.handleQc(qc)) || delete this.qc;
  }
  static handleQc(qcs) {
    return qcs.map((qc) => mSearchSerialize(new QueryComponent(qc)));
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
    return `${this.protocol}://${this.cluster}.search.blackbird.am/${this.fq}`;
  }
  search(req) {
    return request
    .get(`${this.target}/search`)
    .query(new SearchRequest(req));
  }
  msearch(req) {
    return request
    .get(`${this.target}/msearch`)
    .query(new MultiSearchRequest(req));
  }
}

let Blackbird = {
  Engine,
  CnfFilter,
  DnfFilter,
  EnumFacet,
  HistFacet,
  RangeFacet,
  SearchRequest,
  MultiSearchRequest,
  AscSort,
  DescSort
};

export default Blackbird;
