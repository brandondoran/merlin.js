'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _should = require('should');

var _should2 = _interopRequireWildcard(_should);

var _Blackbird = require('../es5');

var _Blackbird2 = _interopRequireWildcard(_Blackbird);

var _SearchRequest = require('../es5/request');

describe('Blackbird', function () {
  // Blackbird.Filter
  describe('Filter', function () {
    it('should throw when not given a field', function () {
      var instantiateFilterWithoutField = function instantiateFilterWithoutField() {
        return _Blackbird2['default'].cnfFilter({});
      };
      instantiateFilterWithoutField.should['throw']();
    });
    it('should throw when field is not a string', function () {
      var instantiateFilter = function instantiateFilter() {
        _Blackbird2['default'].cnfFilter({
          field: {},
          operator: '<',
          value: 100
        });
      };
      instantiateFilter.should['throw']();
    });
    it('should throw when not given an operator');
    it('should throw when given an invalid operator');
    it('should throw when field is invalid');
    it('should throw when value is not a string or number');
    it('should allow OR chaining');
    it('should allow AND chaining');
    it('should allow tagging');
  });

  // Blackbird.Facet
  describe('Facet', function () {
    it('should throw an error when not given a field');
    it('should throw an error when field name is invalid');
    it('EnumFacet.toString() should return the correct string');
    it('EnumFacet should require a num');
    it('HistFacet.toString() should return the correct string');
    it('HistFacet should take a start, stop, and gap');
    it('RangeFacet.toString() should return the correct string');
  });

  // Blackbird.Sort
  describe('Sort', function () {
    it('should throw when not given a field', function () {
      var instantiateEmptySort = function instantiateEmptySort() {
        return _Blackbird2['default'].ascSort({});
      };
      instantiateEmptySort.should['throw']();
    });
    it('AscSort.toString() should return the correct string', function () {
      var ascSort = _Blackbird2['default'].ascSort({ field: 'price' });
      ascSort.toString().should.equal('price:asc');
    });
    it('DescSort.toString() should return the correct string', function () {
      var descSort = _Blackbird2['default'].descSort({ field: 'price' });
      descSort.toString().should.equal('price:desc');
    });
  });

  // SearchRequest
  describe('SearchRequest', function () {
    it('should throw an error when being instantiated without a q', function () {
      var instantiateEmptyRequest = function instantiateEmptyRequest() {
        return _Blackbird2['default'].searchRequest({});
      };
      instantiateEmptyRequest.should['throw']();
    });
    describe('handleFields', function () {
      it('should return the input when the input is a string', function () {
        _SearchRequest.SearchRequest.handleFields('test').should.not.equal('nottest');
        _SearchRequest.SearchRequest.handleFields('test').should.equal('test');
      });
      it('should return the join the input when the input is an array of strings', function () {
        _SearchRequest.SearchRequest.handleFields(['a']).should.equal('a');
        _SearchRequest.SearchRequest.handleFields(['a', 'b']).should.equal('a,b');
      });
    });
    describe('handleFacetsAndFilters', function () {
      var options1 = {
        field: 'color',
        operator: '=',
        value: 'black'
      };
      var options2 = {
        field: 'price',
        operator: '<',
        value: '100.00'
      };
      var filter1 = _Blackbird2['default'].cnfFilter(options1);
      var filter2 = _Blackbird2['default'].cnfFilter(options2);
      var facet1 = _Blackbird2['default'].enumFacet({
        field: 'brand',
        num: 5
      });
      var facet2 = _Blackbird2['default'].rangeFacet({
        field: 'price'
      });
      it('should return the string form of a Filter when passed a Filter as input', function () {
        _SearchRequest.SearchRequest.handleFacetsAndFilters(filter1).should.equal('exp=color:black/type=cnf');
      });
      it('should return an array of the string forms of Filters when passed an array of Filters', function () {
        var filters = [filter1, filter2];
        var handled = _SearchRequest.SearchRequest.handleFacetsAndFilters(filters);
        handled.should.be.an.Array;
        handled[0].should.equal('exp=color:black/type=cnf');
        handled[1].should.equal('exp=price:(:100.00)/type=cnf');
      });
      it('should return the string form of a Facet when passed a Facet as input', function () {
        _SearchRequest.SearchRequest.handleFacetsAndFilters(facet1).should.equal('field=brand/type=enum/num=5');
      });
      it('should return an array of the string forms of Facets when passed an array of Facets', function () {
        var facets = [facet1, facet2];
        var handled = _SearchRequest.SearchRequest.handleFacetsAndFilters(facets);
        handled.should.be.an.Array;
        handled[0].should.equal('field=brand/type=enum/num=5');
        handled[1].should.equal('field=price/type=range');
      });
    });
  });

  //Blackbird.Engine
  describe('Engine', function () {
    it('should exist', function () {
      _should2['default'].exist(_Blackbird2['default'].engine);
    });
    it('should throw an error when missing a company', function () {
      var instantiateEngineWithoutCompany = function instantiateEngineWithoutCompany() {
        _Blackbird2['default'].engine({
          environment: 'staging',
          instance: 'wrangler'
        });
      };
      instantiateEngineWithoutCompany.should['throw']();
    });
    it('should throw an error when missing a environment', function () {
      var instantiateEngineWithoutEnvironment = function instantiateEngineWithoutEnvironment() {
        _Blackbird2['default'].engine({
          company: 'thredup',
          instance: 'wrangler'
        });
      };
      instantiateEngineWithoutEnvironment.should['throw']();
    });
    it('should throw an error when missing an instance', function () {
      var instantiateEngineWithoutInstance = function instantiateEngineWithoutInstance() {
        _Blackbird2['default'].engine({
          company: 'thredup',
          environment: 'staging'
        });
      };
      instantiateEngineWithoutInstance.should['throw']();
    });

    // Blackbird.Engine.search
    describe('search', function () {
      var engine = _Blackbird2['default'].engine({
        company: 'thredup',
        environment: 'staging',
        instance: 'wrangler'
      });
      it('should search given just a q', function (done) {
        engine.search({ q: 'dress' }).then(function (res) {
          // should.not.exist(err);
          _should2['default'].exist(res);
          done();
        });
      });
    });
    describe('msearch', function () {
      var engine = _Blackbird2['default'].engine({
        company: 'thredup',
        environment: 'staging',
        instance: 'wrangler'
      });
      it('should msearch given just 2 qs', function (done) {
        engine.msearch({
          qc: [{ q: 'dress', fields: '[all]' }, { q: 'shoes', sort: _Blackbird2['default'].ascSort({ field: 'price' }) }]
        }).then(function (res) {
          // should.not.exist(err);
          _should2['default'].exist(res);
          done();
        });
      });
    });
  });
  describe('typeahead', function () {
    var engine = _Blackbird2['default'].engine({
      company: 'thredup',
      environment: 'staging',
      instance: 'wrangler'
    });
    it('should typeahead given a q', function (done) {
      engine.typeahead({
        q: 'dres'
      }).then(function (res) {
        // should.not.exist(err);
        _should2['default'].exist(res);
        done();
      });
    });
  });
});