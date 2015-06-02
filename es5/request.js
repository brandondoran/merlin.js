'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports.similarRequest = similarRequest;
exports.typeaheadRequest = typeaheadRequest;
exports.searchRequest = searchRequest;
exports.multiSearchRequest = multiSearchRequest;

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _helpers = require('./helpers');

var Request = (function () {
  function Request(options) {
    _classCallCheck(this, Request);

    // todo: clean this up
    (0, _helpers.set)(this, 'start', Number(options.start));
    (0, _helpers.set)(this, 'num', Number(options.num));
    (0, _helpers.set)(this, 'sort', Request.handleSorts(options.sort));
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
    this.q = options.q || '';
    (0, _helpers.set)(this, 'fields', SearchRequest.handleFields(options.fields));
    (0, _helpers.set)(this, 'facet', SearchRequest.handleFacetsAndFilters(options.facet));
    (0, _helpers.set)(this, 'filter', SearchRequest.handleFacetsAndFilters(options.filter));
    if (!(0, _helpers.checkConstructor)(this.q, String)) {
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

  this.q = options.q || '';
  (0, _helpers.set)(this, 'filter', SearchRequest.handleFacetsAndFilters(options.filter));
  if (!(0, _helpers.checkConstructor)(this.q, String)) {
    throw new Error('QueryComponent#q must be a string.');
  }
};

var MultiSearchRequest = (function (_Request2) {
  function MultiSearchRequest(options) {
    _classCallCheck(this, MultiSearchRequest);

    _get(Object.getPrototypeOf(MultiSearchRequest.prototype), 'constructor', this).call(this, options);
    var qc = options.qc;
    if (qc.length >= 6) {
      throw new Error('A multi-search only supports up to 6 queries.');
    }
    (0, _helpers.set)(this, 'qc', MultiSearchRequest.handleQc(qc));
  }

  _inherits(MultiSearchRequest, _Request2);

  _createClass(MultiSearchRequest, null, [{
    key: 'handleQc',
    value: function handleQc(qcs) {
      return qcs.map(function (qc) {
        return (0, _helpers.mSearchSerialize)(new QueryComponent(qc));
      });
    }
  }]);

  return MultiSearchRequest;
})(Request);

exports.MultiSearchRequest = MultiSearchRequest;

var TypeaheadRequest = function TypeaheadRequest(options) {
  _classCallCheck(this, TypeaheadRequest);

  this.q = options.q || '';
  if (!(0, _helpers.checkConstructor)(this.q, String)) {
    throw new Error('TypeaheadRequest#q must be a string.');
  }
};

exports.TypeaheadRequest = TypeaheadRequest;

var SimilarRequest = function SimilarRequest(options) {
  _classCallCheck(this, SimilarRequest);

  this.id = options.id;
  (0, _helpers.set)(this, 'num', options.num);
  (0, _helpers.set)(this, 'filter', SearchRequest.handleFacetsAndFilters(options.filter));
  (0, _helpers.set)(this, 'fields', SearchRequest.handleFields(options.fields));
};

exports.SimilarRequest = SimilarRequest;

function similarRequest(options) {
  return new SimilarRequest(options);
}

function typeaheadRequest(options) {
  return new TypeaheadRequest(options);
}

function searchRequest(options) {
  return new SearchRequest(options);
}

function multiSearchRequest(options) {
  return new MultiSearchRequest(options);
}