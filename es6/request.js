'use strict';

import {checkConstructor, mSearchSerialize} from './helpers';

export class Request {
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

export class SearchRequest extends Request {
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

export class MultiSearchRequest extends Request {
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

export class TypeaheadRequest {
  constructor(options) {
    (this.q = options.q) || delete this.q;
    if (!this.q) {
      throw new Error('TypeaheadRequest#q is required.');
    }
  }
}

export function typeaheadRequest(options) {
  return new TypeaheadRequest(options);
}

export function searchRequest(options) {
  return new SearchRequest(options);
}

export function multiSearchRequest(options) {
  return new MultiSearchRequest(options);
}
