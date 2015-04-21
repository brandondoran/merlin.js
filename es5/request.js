'use strict';

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.searchRequest = searchRequest;
exports.multiSearchRequest = multiSearchRequest;

var _checkConstructor$mSearchSerialize = require('./helpers');

'use strict';

var Request = (function () {
  function Request(options) {
    _classCallCheck(this, Request);

    // todo: clean this up
    (this.start = Number(options.start)) || delete this.start;
    (this.num = Number(options.num)) || delete this.num;
    (this.sort = Request.handleSorts(options.sort)) || delete this.sort;
  }

  _createClass(Request, null, [{
    key: 'handleSorts',
    value: function handleSorts(input) {
      if (Array.isArray(input)) {
        return input.map(function (sort) {
          return sort.toString();
        }).join(',');
      }
      return input;
    }
  }]);

  return Request;
})();

exports.Request = Request;

var SearchRequest = (function (_Request) {
  function SearchRequest(options) {
    _classCallCheck(this, SearchRequest);

    _get(Object.getPrototypeOf(SearchRequest.prototype), 'constructor', this).call(this, options);
    (this.q = options.q) || delete this.q;
    (this.fields = SearchRequest.handleFields(options.fields)) || delete this.fields;
    (this.facet = SearchRequest.handleFacetsAndFilters(options.facet)) || delete this.facet;
    (this.filter = SearchRequest.handleFacetsAndFilters(options.filter)) || delete this.filter;
    if (!this.q) {
      throw new Error('The \'q\' parameter is required.');
    }
    if (!_checkConstructor$mSearchSerialize.checkConstructor(this.q, String)) {
      throw new Error('Request#q must be a string.');
    }
  }

  _inherits(SearchRequest, _Request);

  _createClass(SearchRequest, null, [{
    key: 'handleFields',
    value: function handleFields(input) {
      if (Array.isArray(input)) {
        return input.join(',');
      }
      return input;
    }
  }, {
    key: 'handleFacetsAndFilters',
    value: function handleFacetsAndFilters(input) {
      if (Array.isArray(input)) {
        return input.map(SearchRequest.handleFacetsAndFilters);
      }
      if (input) {
        return input.toString();
      }
    }
  }]);

  return SearchRequest;
})(Request);

exports.SearchRequest = SearchRequest;

var QueryComponent = function QueryComponent(options) {
  _classCallCheck(this, QueryComponent);

  (this.q = options.q) || delete this.q;
  (this.filter = SearchRequest.handleFacetsAndFilters(options.filter)) || delete this.filter;
};

var MultiSearchRequest = (function (_Request2) {
  function MultiSearchRequest(options) {
    _classCallCheck(this, MultiSearchRequest);

    _get(Object.getPrototypeOf(MultiSearchRequest.prototype), 'constructor', this).call(this, options);
    var qc = options.qc;

    if (qc.length >= 6) {
      throw new Error('A multi-search only supports up to 6 queries.');
    }
    (this.qc = MultiSearchRequest.handleQc(qc)) || delete this.qc;
  }

  _inherits(MultiSearchRequest, _Request2);

  _createClass(MultiSearchRequest, null, [{
    key: 'handleQc',
    value: function handleQc(qcs) {
      return qcs.map(function (qc) {
        return _checkConstructor$mSearchSerialize.mSearchSerialize(new QueryComponent(qc));
      });
    }
  }]);

  return MultiSearchRequest;
})(Request);

exports.MultiSearchRequest = MultiSearchRequest;

function searchRequest(options) {
  return new SearchRequest(options);
}

function multiSearchRequest(options) {
  return new MultiSearchRequest(options);
}