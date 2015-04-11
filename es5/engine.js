'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _request = require('superagent');

var _request2 = _interopRequireWildcard(_request);

var _SearchRequest$MultiSearchRequest = require('./request');

'use strict';

var Engine = (function () {
  function Engine(options) {
    _classCallCheck(this, Engine);

    this.protocol = options.protocol || 'https';
    this.company = options.company;
    this.environment = options.environment;
    this.instance = options.instance;

    if (!this.company) {
      throw new Error('The \'company\' parameter is required.');
    }
    if (!this.environment) {
      throw new Error('The \'environment\' parameter is required.');
    }
    if (!this.instance) {
      throw new Error('The \'instance\' parameter is required.');
    }
  }

  _createClass(Engine, [{
    key: 'fq',
    get: function () {
      return '' + this.company + '.' + this.environment + '.' + this.instance;
    }
  }, {
    key: 'cluster',
    get: function () {
      return 'search-' + this.environment;
    }
  }, {
    key: 'target',
    get: function () {
      return '' + this.protocol + '://' + this.cluster + '.search.blackbird.am/' + this.fq;
    }
  }, {
    key: 'search',
    value: function search(req) {
      return _request2['default'].get('' + this.target + '/search').query(new _SearchRequest$MultiSearchRequest.SearchRequest(req));
    }
  }, {
    key: 'msearch',
    value: function msearch(req) {
      return _request2['default'].get('' + this.target + '/msearch').query(new _SearchRequest$MultiSearchRequest.MultiSearchRequest(req));
    }
  }]);

  return Engine;
})();

exports['default'] = Engine;
module.exports = exports['default'];