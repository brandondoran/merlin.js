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