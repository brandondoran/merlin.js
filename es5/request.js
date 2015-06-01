'use strict';

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.typeaheadRequest = typeaheadRequest;
exports.searchRequest = searchRequest;
exports.multiSearchRequest = multiSearchRequest;

var _checkConstructor$mSearchSerialize$set = require('./helpers');

'use strict';

var Request = (function () {
  function Request(options) {
    _classCallCheck(this, Request);

    // todo: clean this up
    _checkConstructor$mSearchSerialize$set.set(this, 'start', Number(options.start));
    _checkConstructor$mSearchSerialize$set.set(this, 'num', Number(options.num));
    _checkConstructor$mSearchSerialize$set.set(this, 'sort', Request.handleSorts(options.sort));
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
    _checkConstructor$mSearchSerialize$set.set(this, 'fields', SearchRequest.handleFields(options.fields));
    _checkConstructor$mSearchSerialize$set.set(this, 'facet', SearchRequest.handleFacetsAndFilters(options.facet));
    _checkConstructor$mSearchSerialize$set.set(this, 'filter', SearchRequest.handleFacetsAndFilters(options.filter));
    if (!_checkConstructor$mSearchSerialize$set.checkConstructor(this.q, String)) {
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
  _checkConstructor$mSearchSerialize$set.set(this, 'filter', SearchRequest.handleFacetsAndFilters(options.filter));
  if (!_checkConstructor$mSearchSerialize$set.checkConstructor(this.q, String)) {
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
    _checkConstructor$mSearchSerialize$set.set(this, 'qc', MultiSearchRequest.handleQc(qc));
  }

  _inherits(MultiSearchRequest, _Request2);

  _createClass(MultiSearchRequest, null, [{
    key: 'handleQc',
    value: function handleQc(qcs) {
      return qcs.map(function (qc) {
        return _checkConstructor$mSearchSerialize$set.mSearchSerialize(new QueryComponent(qc));
      });
    }
  }]);

  return MultiSearchRequest;
})(Request);

exports.MultiSearchRequest = MultiSearchRequest;

var TypeaheadRequest = function TypeaheadRequest(options) {
  _classCallCheck(this, TypeaheadRequest);

  this.q = options.q || '';
  if (!_checkConstructor$mSearchSerialize$set.checkConstructor(this.q, String)) {
    throw new Error('TypeaheadRequest#q must be a string.');
  }
};

exports.TypeaheadRequest = TypeaheadRequest;

function typeaheadRequest(options) {
  return new TypeaheadRequest(options);
}

function searchRequest(options) {
  return new SearchRequest(options);
}

function multiSearchRequest(options) {
  return new MultiSearchRequest(options);
}