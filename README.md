## Merlin JavaScript Library

This is the JavaScript library for Merlin Search.

## Dependencies

        npm install
        npm install -g babel
        npm install -g webpack

## Build

        $ npm run build

## Running the tests

        $ npm test

## Example usage (node)

        $ node
        > var Blackbird = require('./es5')
        > var engine = new Blackbird.Engine({company: 'thredup', environment: 'prod',  instance: 'thredup'})
        > engine.search({q: 'dress'}).end(function (e, r) { console.log(r.body.results.numfound) })

## Documentation

- [search-api](http://blackbird.am/docs?javascript#search-api)
- [multisearch-api](http://blackbird.am/docs?javascript#multi-search-api)
