'use strict';

var Blackbird = window.Blackbird;

var engine = new Blackbird.Engine({
  company: 'thredup',
  environment: 'prod',
  instance: 'thredup'
});

var req1 = {
  q: 'dress',
  filter: [
    new Blackbird.CnfFilter({
      field: 'colors',
      operator: '=',
      value: 'blue'
    }).or({
      field: 'sizes',
      operator: '>',
      value: 3
    }).tag('bluethingsbiggerthan3')
  ],
  facet: new Blackbird.EnumFacet({
    field: 'brand',
    num: 5
  }),
  sort: 'sat1:asc'
};

var req2 = {
  q: 'shoes',
  filter: [
    new Blackbird.DnfFilter({
      field: 'colors',
      operator: '=',
      value: 'blue'
    }).or({
      field: 'sizes',
      operator: '>',
      value: 3
    }).tag('bluethingsbiggerthan3')
  ],
  facet: new Blackbird.EnumFacet({
    field: 'brand',
    num: 5
  }),
  sort: new Blackbird.Sort({
    field: 'sat1',
    ordering: 'desc'
  })
};

engine.search(req1).end(function (err, res) {
  if (err) {
    console.log(err);
    return;
  }
  console.log(res.body);
});

engine.search(req2).end(function (err, res) {
  if (err) {
    console.log(err);
    return;
  }
  console.log(res.body);
});
