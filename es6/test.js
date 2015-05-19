'use strict';

import should from 'should';
import Blackbird from '../es5';
import {SearchRequest} from '../es5/request';

describe('Blackbird', () => {
  // Blackbird.Filter
  describe('Filter', () => {
    it('should throw when not given a field', () => {
      let instantiateFilterWithoutField = () => Blackbird.cnfFilter({});
      instantiateFilterWithoutField.should.throw();
    });
    it('should throw when field is not a string', () => {
      let instantiateFilter = () => {
        Blackbird.cnfFilter({
          field: {},
          operator: '<',
          value: 100
        });
      };
      instantiateFilter.should.throw();
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
  describe('Facet', () => {
    it('should throw an error when not given a field');
    it('should throw an error when field name is invalid');
    it('EnumFacet.toString() should return the correct string');
    it('EnumFacet should require a num');
    it('HistFacet.toString() should return the correct string');
    it('HistFacet should take a start, stop, and gap');
    it('RangeFacet.toString() should return the correct string');
  });

  // Blackbird.Sort
  describe('Sort', () => {
    it('should throw when not given a field', () => {
      let instantiateEmptySort = () => Blackbird.ascSort({});
      instantiateEmptySort.should.throw();
    });
    it('AscSort.toString() should return the correct string', () => {
      let ascSort = Blackbird.ascSort({ field: 'price' });
      ascSort.toString().should.equal('price:asc');
    });
    it('DescSort.toString() should return the correct string', () => {
      let descSort = Blackbird.descSort({ field: 'price' });
      descSort.toString().should.equal('price:desc');
    });
  });

  // SearchRequest
  describe('SearchRequest', () => {
    it('should not throw an error when being instantiated without a q', () => {
      let instantiateEmptyRequest = () => Blackbird.searchRequest({});
      instantiateEmptyRequest().q.should.equal('');
      instantiateEmptyRequest.should.not.throw();
    });
    describe('handleFields', () => {
      it('should return the input when the input is a string', () => {
        SearchRequest.handleFields('test').should.not.equal('nottest');
        SearchRequest.handleFields('test').should.equal('test');
      });
      it('should return the join the input when the input is an array of strings', () => {
        SearchRequest.handleFields(['a']).should.equal('a');
        SearchRequest.handleFields(['a', 'b']).should.equal('a,b');
      });
    });
    describe('handleFacetsAndFilters', () => {
      let options1 = {
        field: 'color',
        operator: '=',
        value: 'black'
      };
      let options2 = {
        field: 'price',
        operator: '<',
        value: '100.00'
      };
      let filter1 = Blackbird.cnfFilter(options1);
      let filter2 = Blackbird.cnfFilter(options2);
      let facet1 = Blackbird.enumFacet({
        field: 'brand',
        num: 5
      });
      let facet2 = Blackbird.rangeFacet({
        field: 'price'
      });
      it('should return the string form of a Filter when passed a Filter as input', () => {
        SearchRequest.handleFacetsAndFilters(filter1).should.equal('exp=color:black/type=cnf');
      });
      it('should return an array of the string forms of Filters when passed an array of Filters', () => {
        let filters = [filter1, filter2];
        let handled = SearchRequest.handleFacetsAndFilters(filters);
        handled.should.be.an.Array;
        handled[0].should.equal('exp=color:black/type=cnf');
        handled[1].should.equal('exp=price:(:100.00)/type=cnf');
      });
      it('should return the string form of a Facet when passed a Facet as input', () => {
        SearchRequest.handleFacetsAndFilters(facet1).should.equal('field=brand/type=enum/num=5');
      });
      it('should return an array of the string forms of Facets when passed an array of Facets', () => {
        let facets = [facet1, facet2];
        let handled = SearchRequest.handleFacetsAndFilters(facets);
        handled.should.be.an.Array;
        handled[0].should.equal('field=brand/type=enum/num=5');
        handled[1].should.equal('field=price/type=range');
      });
    });
  });

  //Blackbird.Engine
  describe('Engine', () => {
    it('should exist', () => {
      should.exist(Blackbird.engine);
    });
    it('should throw an error when missing a company', () => {
      let instantiateEngineWithoutCompany = () => {
        Blackbird.engine({
          environment: 'staging',
          instance: 'wrangler'
        });
      };
      instantiateEngineWithoutCompany.should.throw();
    });
    it('should throw an error when missing a environment', () => {
      let instantiateEngineWithoutEnvironment = () => {
        Blackbird.engine({
          company: 'thredup',
          instance: 'wrangler'
        });
      };
      instantiateEngineWithoutEnvironment.should.throw();
    });
    it('should throw an error when missing an instance', () => {
      let instantiateEngineWithoutInstance = () => {
        Blackbird.engine({
          company: 'thredup',
          environment: 'staging'
        });
      };
      instantiateEngineWithoutInstance.should.throw();
    });

    // Blackbird.Engine.search
    describe('search', () => {
      const engine = Blackbird.engine({
        company: 'thredup',
        environment: 'staging',
        instance: 'wrangler'
      });
      it('should search given just a q', (done) => {
        engine.search({ q: 'dress' })
        .end((err, res) => {
          should.not.exist(err);
          should.exist(res);
          done(err, res);
        });
      });
    });
    describe('msearch', () => {
      const engine = Blackbird.engine({
        company: 'thredup',
        environment: 'staging',
        instance: 'wrangler'
      });
      it('should msearch given just 2 qs', (done) => {
        engine.msearch({
          qc: [
            { q: 'dress', fields: '[all]' },
            { q: 'shoes', sort: Blackbird.ascSort({ field: 'price' }) }
          ]
        })
        .end((err, res) => {
          should.not.exist(err);
          should.exist(res);
          done(err, res);
        });
      });
    });
  });
  describe('typeahead', () => {
    const engine = Blackbird.engine({
      company: 'thredup',
      environment: 'staging',
      instance: 'wrangler'
    });
    it('should typeahead given a q', (done) => {
      engine.typeahead({
        q: 'dres'
      })
      .end((err, res) => {
        should.not.exist(err);
        should.exist(res);
        done(err, res);
      });
    });
  });
});
