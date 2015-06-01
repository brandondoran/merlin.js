'use strict';

class TrackRequest {
  constructor(options) {
    this.type = options.type;
    if (!this.type) {
      throw new Error('A tracking request requires a type from the following: click, cart_add, cart_remove, purchase.');
    }
    this.query = {
      qid: options.qid,
      docids: options.docids,
      uid: options.uid, // optional
      sid: options.sid // optional
    };
    if (!this.query.qid) {
      throw new Error('A tracking request requires a qid.');
    }
    if (!this.query.docids) {
      throw new Error('A tracking request requires docids.');
    }
  }
}

export function trackRequest(options) {
  return new TrackRequest(options);
}
