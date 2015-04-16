'use strict';

import {CnfFilter, DnfFilter} from './filter';
import {EnumFacet, HistFacet, RangeFacet} from './facet';
import {AscSort, DescSort} from './sort';
import {SearchRequest, MultiSearchRequest} from './request';
import Engine from './engine';

let Blackbird = {
  CnfFilter,
  DnfFilter,
  EnumFacet,
  HistFacet,
  RangeFacet,
  AscSort,
  DescSort,
  SearchRequest,
  MultiSearchRequest,
  Engine
};

let globalScope = (new Function('return this'))();
globalScope.Blackbird = Blackbird;

export default Blackbird;
