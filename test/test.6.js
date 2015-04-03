'use strict';

import should from 'should';
import Blackbird from '../dist/merlin.js';

describe('Blackbird', () => {
  describe('Engine', () => {
    it('should exist', () => {
      should.exist(Blackbird.Engine);
    });
    describe('search', () => {
      const engine = new Blackbird.Engine({
        company: 'thredup',
        environment: 'prod',
        instance: 'thredup'
      });
      it('should search given just a q', () => {
        engine.search({ q: 'dress' })
        .end((err, res) => console.log(err, res));
      });
    });
  });
});