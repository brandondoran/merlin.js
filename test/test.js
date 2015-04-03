"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var should = _interopRequire(require("should"));

var Blackbird = _interopRequire(require("../dist/merlin.js"));

console.log(Blackbird)

describe("Blackbird", function () {
  describe("Engine", function () {
    it("should exist", function () {
      should.exist(Blackbird.Engine);
    });
    describe("search", function () {
      // var engine = new Blackbird.Engine({
      //   company: "thredup",
      //   environment: "prod",
      //   instance: "thredup"
      // });
      it("should search given just a q", function () {
        // engine.search({ q: "dress" }).end(function (err, res) {
        //   return console.log(err, res);
        // });
      });
    });
  });
});
