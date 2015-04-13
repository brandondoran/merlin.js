'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _should = require('should');

var _should2 = _interopRequireWildcard(_should);

var _Blackbird = require('../es5');

var _Blackbird2 = _interopRequireWildcard(_Blackbird);

describe('Blackbird', function () {
  // Blackbird.Filter
  describe('Filter', function () {
    it('should throw when not given a field', function () {
      var instantiateFilterWithoutField = function instantiateFilterWithoutField() {
        return new _Blackbird2['default'].CnfFilter({});
      };
      instantiateFilterWithoutField.should['throw']();
    });
    it('should throw when field is not a string', function () {
      var instantiateFilter = function instantiateFilter() {
        new _Blackbird2['default'].CnfFilter({
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
        return new _Blackbird2['default'].AscSort({});
      };
      instantiateEmptySort.should['throw']();
    });
    it('AscSort.toString() should return the correct string', function () {
      var ascSort = new _Blackbird2['default'].AscSort({ field: 'price' });
      ascSort.toString().should.equal('price:asc');
    });
    it('DescSort.toString() should return the correct string', function () {
      var descSort = new _Blackbird2['default'].DescSort({ field: 'price' });
      descSort.toString().should.equal('price:desc');
    });
  });

  // Blackbird.SearchRequest
  describe('SearchRequest', function () {
    it('should throw an error when being instantiated without a q', function () {
      var instantiateEmptyRequest = function instantiateEmptyRequest() {
        return new _Blackbird2['default'].SearchRequest({});
      };
      instantiateEmptyRequest.should['throw']();
    });
    describe('handleFields', function () {
      it('should return the input when the input is a string', function () {
        _Blackbird2['default'].SearchRequest.handleFields('test').should.not.equal('nottest');
        _Blackbird2['default'].SearchRequest.handleFields('test').should.equal('test');
      });
      it('should return the join the input when the input is an array of strings', function () {
        _Blackbird2['default'].SearchRequest.handleFields(['a']).should.equal('a');
        _Blackbird2['default'].SearchRequest.handleFields(['a', 'b']).should.equal('a,b');
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
      var filter1 = new _Blackbird2['default'].CnfFilter(options1);
      var filter2 = new _Blackbird2['default'].CnfFilter(options2);
      var facet1 = new _Blackbird2['default'].EnumFacet({
        field: 'brand',
        num: 5
      });
      var facet2 = new _Blackbird2['default'].RangeFacet({
        field: 'price'
      });
      it('should return the string form of a Filter when passed a Filter as input', function () {
        _Blackbird2['default'].SearchRequest.handleFacetsAndFilters(filter1).should.equal('exp=color:black/type=cnf');
      });
      it('should return an array of the string forms of Filters when passed an array of Filters', function () {
        var filters = [filter1, filter2];
        var handled = _Blackbird2['default'].SearchRequest.handleFacetsAndFilters(filters);
        handled.should.be.an.Array;
        handled[0].should.equal('exp=color:black/type=cnf');
        handled[1].should.equal('exp=price:(:100.00)/type=cnf');
      });
      it('should return the string form of a Facet when passed a Facet as input', function () {
        _Blackbird2['default'].SearchRequest.handleFacetsAndFilters(facet1).should.equal('field=brand/type=enum/num=5');
      });
      it('should return an array of the string forms of Facets when passed an array of Facets', function () {
        var facets = [facet1, facet2];
        var handled = _Blackbird2['default'].SearchRequest.handleFacetsAndFilters(facets);
        handled.should.be.an.Array;
        handled[0].should.equal('field=brand/type=enum/num=5');
        handled[1].should.equal('field=price/type=range');
      });
    });
  });

  //Blackbird.Engine
  describe('Engine', function () {
    it('should exist', function () {
      _should2['default'].exist(_Blackbird2['default'].Engine);
    });
    it('should throw an error when missing a company', function () {
      var instantiateEngineWithoutCompany = function instantiateEngineWithoutCompany() {
        new _Blackbird2['default'].Engine({
          environment: 'prod',
          instance: 'thredup'
        });
      };
      instantiateEngineWithoutCompany.should['throw']();
    });
    it('should throw an error when missing a environment', function () {
      var instantiateEngineWithoutEnvironment = function instantiateEngineWithoutEnvironment() {
        new _Blackbird2['default'].Engine({
          company: 'thredup',
          instance: 'thredup'
        });
      };
      instantiateEngineWithoutEnvironment.should['throw']();
    });
    it('should throw an error when missing an instance', function () {
      var instantiateEngineWithoutInstance = function instantiateEngineWithoutInstance() {
        new _Blackbird2['default'].Engine({
          company: 'thredup',
          environment: 'prod'
        });
      };
      instantiateEngineWithoutInstance.should['throw']();
    });

    // Blackbird.Engine.search
    describe('search', function () {
      var engine = new _Blackbird2['default'].Engine({
        company: 'thredup',
        environment: 'prod',
        instance: 'thredup'
      });
      it('should search given just a q', function (done) {
        engine.search({ q: 'dress' }).end(function (err, res) {
          _should2['default'].not.exist(err);
          _should2['default'].exist(res);
          done(err, res);
        });
      });
    });
    describe('msearch', function () {
      var engine = new _Blackbird2['default'].Engine({
        company: 'thredup',
        environment: 'prod',
        instance: 'thredup'
      });
      it('should msearch given just 2 qs', function (done) {
        engine.msearch({
          qc: [{ q: 'dress', fields: '[all]' }, { q: 'shoes', sort: new _Blackbird2['default'].AscSort({ field: 'price' }) }]
        }).end(function (err, res) {
          _should2['default'].not.exist(err);
          _should2['default'].exist(res);
          done(err, res);
        });
      });
    });
  });
});