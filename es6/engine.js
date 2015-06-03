'use strict';

import request from 'superagent';

import {RE2} from './helpers';
import {searchRequest, multiSearchRequest, typeaheadRequest, similarRequest} from './request';

class Engine {
  constructor(options) {
    this.protocol = options.protocol || 'https';
    this.company = options.company;
    this.environment = options.environment;
    this.instance = options.instance;
    this.fq = options.fq;
    this.typeaheadRateLimit = options.typeaheadRateLimit || 20;

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
  set fq(val) {
    let groups = RE2.exec(val);
    if (groups) {
      let [, company, environment, instance] = groups;
      this.company = company;
      this.environment = environment;
      this.instance = instance;
    }
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
    .query(searchRequest(req));
  }
  msearch(req) {
    return request
    .get(`${this.target}/msearch`)
    .query(multiSearchRequest(req));
  }
  typeahead(req) {
    return request
    .get(`${this.target}/typeahead`)
    .query(typeaheadRequest(req));
  }
  vrec(req) {
    return request
    .get(`${this.target}/vrec`)
    .query(similarRequest(req));
  }
  feedback(req) {
    let treq = trackRequest(req);
    return request
    .get(`${this.target}/track/${treq.type}`)
    .query(treq.query);
  }
}

export default function engine(options) {
  return new Engine(options);
}
