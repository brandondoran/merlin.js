'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _filter = require('./filter');

var _facet = require('./facet');

var _sort = require('./sort');

var _request = require('./request');

var _engine = require('./engine');

var _engine2 = _interopRequireDefault(_engine);

var Blackbird = {
  cnfFilter: _filter.cnfFilter,
  dnfFilter: _filter.dnfFilter,
  enumFacet: _facet.enumFacet,
  histFacet: _facet.histFacet,
  rangeFacet: _facet.rangeFacet,
  ascSort: _sort.ascSort,
  descSort: _sort.descSort,
  searchRequest: _request.searchRequest,
  multiSearchRequest: _request.multiSearchRequest,
  engine: _engine2['default'],
  version: '0.5.0'
};

var globalScope = new Function('return this')();
globalScope.Blackbird = Blackbird;

exports['default'] = Blackbird;
module.exports = exports['default'];