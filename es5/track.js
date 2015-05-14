'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.trackRequest = trackRequest;
'use strict';

var TrackRequest = function TrackRequest(options) {
  _classCallCheck(this, TrackRequest);

  this.type = options.type;
  this.query = {
    qId: options.qId,
    docIds: options.docIds,
    uId: options.uI, // optional
    sId: options.sId // optional
  };
};

function trackRequest(options) {
  return new TrackRequest(options);
}