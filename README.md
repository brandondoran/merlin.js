# Merlin JavaScript Library

This is the JavaScript library for Merlin Search.

# Installation

## node (also browserify/webpack compatible)

```sh
npm install merlin.js
```

```javascript
var Blackbird = require('merlin.js');
```


## Browser
```html
<script src="merlin.js"></script>
```

# Usage

For usage examples, see the [Search API documentation](http://blackbird.am/docs?javascript#search-api).

```javascript
var engine = Blackbird.engine({
    company: 'company_name',
    environment: 'environment_name', 
    instance: 'instance_name'
});

engine.search({ q: 'dress' })
.end(function (e, r) { 
    console.log(r.body.results.numfound);
});
```

# Development

Clone the repo, then run the following:

```sh
cd merlin.js
npm install
```

## Build

Building compiles the es5 JavaScript and the webpacked merlin.js

```sh
npm run build
```

## Running the tests (mocha)

```sh
npm test
```

## Documentation

- [search-api](http://blackbird.am/docs?javascript#search-api)
- [multisearch-api](http://blackbird.am/docs?javascript#multi-search-api)
- [typeahead-api](http://blackbird.am/docs?javascript#typeahead-api)
