'use strict';

import {cnfFilter, dnfFilter} from './filter';
import {enumFacet, histFacet, rangeFacet} from './facet';
import {ascSort, descSort} from './sort';
import {searchRequest, multiSearchRequest} from './request';
import engine from './engine';

let Blackbird = {
  cnfFilter,
  dnfFilter,
  enumFacet,
  histFacet,
  rangeFacet,
  ascSort,
  descSort,
  searchRequest,
  multiSearchRequest,
  engine,
  version: '0.5.0'
};

let globalScope = (new Function('return this'))();
globalScope.Blackbird = Blackbird;

export default Blackbird;
