# Merlin JavaScript Library

This is the JavaScript library for Merlin Search.

# Dependencies

        npm install
        npm install --g babel

# Build

        $ npm run build

# Example

        $ cd js
        $ node
        > var Blackbird = require('./merlin')
        > var engine = new Blackbird.Engine({company: 'thredup', environment: 'prod',  instance: 'thredup'})
        > engine.search({q: 'dress'}).end(function (e,r) { console.log(r)} )
