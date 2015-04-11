'use strict';

import request from 'superagent';

import {SearchRequest, MultiSearchRequest} from './request';

export default class Engine {
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
