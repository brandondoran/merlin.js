'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports['default'] = engine;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _helpers = require('./helpers');

var _request = require('./request');

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
      var groups = _helpers.RE2.exec(val);
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
      return _superagent2['default'].get('' + this.target + '/search').query((0, _request.searchRequest)(req));
    }
  }, {
    key: 'msearch',
    value: function msearch(req) {
      return _superagent2['default'].get('' + this.target + '/msearch').query((0, _request.multiSearchRequest)(req));
    }
  }, {
    key: 'typeahead',
    value: function typeahead(req) {
      return _superagent2['default'].get('' + this.target + '/typeahead').query((0, _request.typeaheadRequest)(req));
    }
  }, {
    key: 'vrec',
    value: function vrec(req) {
      return _superagent2['default'].get('' + this.target + '/vrec').query((0, _request.similarRequest)(req));
    }
  }, {
    key: 'feedback',
    value: function feedback(req) {
      var treq = trackRequest(req);
      return _superagent2['default'].get('' + this.target + '/feedback/' + treq.type).query(treq.query);
    }
  }]);

  return Engine;
})();

function engine(options) {
  return new Engine(options);
}

module.exports = exports['default'];