'use strict';

class TrackRequest {
  constructor(options) {
    this.type = options.type;
    if (!this.type) {
      throw new Error('A tracking request requires a type from the following: click, cart_add, cart_remove, purchase.');
    }
    this.query = {
      qId: options.qId,
      docIds: options.docIds,
      uId: options.uI, // optional
      sId: options.sId // optional
    };
    if (!this.query.qId) {
      throw new Error('A tracking request requires a qId.');
    }
    if (!this.query.docIds) {
      throw new Error('A tracking request requires docIds.');
    }
  }
}

export function trackRequest(options) {
  return new TrackRequest(options);
}
