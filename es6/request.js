'use strict';

import {checkConstructor, mSearchSerialize, set} from './helpers';

export class Request {
  constructor(options) {
    // todo: clean this up
    set(this, 'start', Number(options.start));
    set(this, 'num', Number(options.num));
    set(this, 'sort', Request.handleSorts(options.sort));
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
    this.q = options.q || '';
    set(this, 'fields', SearchRequest.handleFields(options.fields));
    set(this, 'facet', SearchRequest.handleFacetsAndFilters(options.facet));
    set(this, 'filter', SearchRequest.handleFacetsAndFilters(options.filter));
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
    this.q = options.q || '';
    set(this, 'filter', SearchRequest.handleFacetsAndFilters(options.filter));
    if (!checkConstructor(this.q, String)) {
      throw new Error('QueryComponent#q must be a string.');
    }
  }
}

export class MultiSearchRequest extends Request {
  constructor(options) {
    super(options);
    let qc = options.qc;
    if (qc.length >= 6) {
      throw new Error('A multi-search only supports up to 6 queries.');
    }
    set(this, 'qc', MultiSearchRequest.handleQc(qc));
  }
  static handleQc(qcs) {
    return qcs.map((qc) => mSearchSerialize(new QueryComponent(qc)));
  }
}

export class TypeaheadRequest {
  constructor(options) {
    this.q = options.q || '';
    if (!checkConstructor(this.q, String)) {
      throw new Error('TypeaheadRequest#q must be a string.');
    }
  }
}

export class SimilarRequest {
  constructor(options) {
    this.id = options.id;
    set(this, 'num', options.num);
    set(this, 'filter', SearchRequest.handleFacetsAndFilters(options.filter));
  }
}

export function similarRequest(options) {
  return new SimilarRequest(options);
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
