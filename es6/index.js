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
  VERSION: '0.5.3'
};

let globalScope = (new Function('return this'))();
globalScope.Blackbird = Blackbird;

export default Blackbird;
