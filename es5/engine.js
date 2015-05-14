'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = engine;

var _request = require('superagent');

var _request2 = _interopRequireWildcard(_request);

var _RE2 = require('./helpers');

var _searchRequest$multiSearchRequest$typeaheadRequest = require('./request');

'use strict';

var Engine = (function () {
  function Engine(options) {
    _classCallCheck(this, Engine);

    this.protocol = options.protocol || 'https';
    this.company = options.company;
    this.environment = options.environment;
    this.instance = options.instance;
    this.fq = options.fq;
    this.typeaheadRateLimit = options.typeaheadRateLimit || 20;

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
    },
    set: function (val) {
      var groups = _RE2.RE2.exec(val);
      if (groups) {
        var _groups = _slicedToArray(groups, 4);

        var company = _groups[1];
        var environment = _groups[2];
        var instance = _groups[3];

        this.company = company;
        this.environment = environment;
        this.instance = instance;
      }
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
      return _request2['default'].get('' + this.target + '/search').query(_searchRequest$multiSearchRequest$typeaheadRequest.searchRequest(req));
    }
  }, {
    key: 'msearch',
    value: function msearch(req) {
      return _request2['default'].get('' + this.target + '/msearch').query(_searchRequest$multiSearchRequest$typeaheadRequest.multiSearchRequest(req));
    }
  }, {
    key: 'typeahead',
    value: function typeahead(req) {
      return _request2['default'].get('' + this.target + '/typeahead').query(_searchRequest$multiSearchRequest$typeaheadRequest.typeaheadRequest(req));
    }
  }, {
    key: 'track',
    value: function track(req) {
      var treq = trackRequest(req);
      return _request2['default'].get('' + this.target + '/track/' + treq.type).query(treq.query);
    }
  }]);

  return Engine;
})();

function engine(options) {
  return new Engine(options);
}

module.exports = exports['default'];