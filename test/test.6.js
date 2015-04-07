'use strict';

import should from 'should';
import Blackbird from '../js/merlin.js';

describe('Blackbird', () => {
  // Blackbird.Request
  describe('Request', () => {
    it('should throw an error when being instantiated without a q', () => {
      let instantiateEmptyRequest = () => new Blackbird.Request({});
      instantiateEmptyRequest.should.throw();
    });
    describe('handleFields', () => {
      it('should return the input when the input is a string', () => {
        Blackbird.Request.handleFields('test').should.not.equal('nottest');
        Blackbird.Request.handleFields('test').should.equal('test');
      });
      it('should return the join the input when the input is an array of strings', () => {
        Blackbird.Request.handleFields(['a']).should.equal('a');
        Blackbird.Request.handleFields(['a', 'b']).should.equal('a,b');
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
      let filter1 = new Blackbird.CnfFilter(options1);
      let filter2 = new Blackbird.CnfFilter(options2);
      let facet1 = new Blackbird.EnumFacet({
        field: 'brand',
        num: 5
      });
      let facet2 = new Blackbird.RangeFacet({
        field: 'price'
      });
      it('should return the string form of a Filter when passed a Filter as input', () => {
        Blackbird.Request.handleFacetsAndFilters(filter1).should.equal('exp=color:black/type=cnf');
      });
      it('should return an array of the string forms of Filters when passed an array of Filters', () => {
        let filters = [filter1, filter2];
        let handled = Blackbird.Request.handleFacetsAndFilters(filters);
        handled.should.be.an.Array;
        handled[0].should.equal('exp=color:black/type=cnf');
        handled[1].should.equal('exp=price:(:100.00)/type=cnf');
      });
      it('should return the string form of a Facet when passed a Facet as input', () => {
        Blackbird.Request.handleFacetsAndFilters(facet1).should.equal('field=brand/type=enum/num=5');
      });
      it('should return an array of the string forms of Facets when passed an array of Facets', () => {
        let facets = [facet1, facet2];
        let handled = Blackbird.Request.handleFacetsAndFilters(facets);
        handled.should.be.an.Array;
        handled[0].should.equal('field=brand/type=enum/num=5');
        handled[1].should.equal('field=price/type=range');
      });
    });
  });

  //Blackbird.Engine
  describe('Engine', () => {
    it('should exist', () => {
      should.exist(Blackbird.Engine);
    });
    it('should throw an error when missing a company', () => {
      let instantiateEngineWithoutCompany = () => {
        new Blackbird.Engine({
          environment: 'prod',
          instance: 'thredup'
        });
      };
      instantiateEngineWithoutCompany.should.throw();
    });
    it('should throw an error when missing a environment', () => {
      let instantiateEngineWithoutEnvironment = () => {
        new Blackbird.Engine({
          company: 'thredup',
          instance: 'thredup'
        });
      };
      instantiateEngineWithoutEnvironment.should.throw();
    });
    it('should throw an error when missing an instance', () => {
      let instantiateEngineWithoutInstance = () => {
        new Blackbird.Engine({
          company: 'thredup',
          environment: 'prod'
        });
      };
      instantiateEngineWithoutInstance.should.throw();
    });

    // Blackbird.Engine.search
    describe('search', () => {
      const engine = new Blackbird.Engine({
        company: 'thredup',
        environment: 'prod',
        instance: 'thredup'
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
  });
});