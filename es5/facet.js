'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports.enumFacet = enumFacet;
exports.histFacet = histFacet;
exports.rangeFacet = rangeFacet;

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _helpers = require('./helpers');

var Facet = (function () {
  function Facet(options) {
    _classCallCheck(this, Facet);

    var field = options.field;

    if (!(0, _helpers.checkConstructor)(field, String)) {
      throw new Error('Facet#field must be a string.');
    }
    if (!_helpers.RE1.test(field)) {
      throw new Error('Facet#field can only contain a-z, 0-9, and underscores, and must start with a lowercase letter.');
    }
    this.field = field;

    if (options.exclude && options.ex) {
      throw new Error('Facet#ex and Facet#exclude cannot both be defined');
    }
    this.ex = [];
    var ex = options.exclude || options.ex;
    if (ex) {
      this.exclude(ex);
    }
  }

  _createClass(Facet, [{
    key: 'exclude',
    value: function exclude(tags) {
      if (typeof tags === 'string') {
        tags = tags.split(',');
      }
      this.ex = this.ex.concat(tags);
      return this;
    }
  }, {
    key: 'key',
    value: function key(val) {
      (0, _helpers.set)(this, '_key', val);
      return this;
    }
  }, {
    key: 'toString',
    value: function toString(val) {
      var kvs = ['field=' + this.field];
      if (val) {
        kvs.push(val);
      }
      if (this._key) {
        kvs.push('key=' + this._key);
      }
      if (this.ex.length) {
        kvs.push('ex=' + this.ex);
      }
      return kvs.join('/');
    }
  }]);

  return Facet;
})();

var EnumFacet = (function (_Facet) {
  function EnumFacet(options) {
    _classCallCheck(this, EnumFacet);

    _get(Object.getPrototypeOf(EnumFacet.prototype), 'constructor', this).call(this, options);
    this.num = Number(options.num) || 0;
  }

  _inherits(EnumFacet, _Facet);

  _createClass(EnumFacet, [{
    key: 'toString',
    value: function toString() {
      return _get(Object.getPrototypeOf(EnumFacet.prototype), 'toString', this).call(this, 'type=enum/num=' + this.num);
    }
  }]);

  return EnumFacet;
})(Facet);

var HistFacet = (function (_Facet2) {
  function HistFacet(options) {
    _classCallCheck(this, HistFacet);

    _get(Object.getPrototypeOf(HistFacet.prototype), 'constructor', this).call(this, options);
    this.start = Number(options.start) || 0;
    this.end = Number(options.end) || 0;
    this.gap = Number(options.gap) || 0;
  }

  _inherits(HistFacet, _Facet2);

  _createClass(HistFacet, [{
    key: 'range',
    get: function () {
      return '[' + this.start + ':' + this.end + ':' + this.gap + ']';
    }
  }, {
    key: 'toString',
    value: function toString() {
      return _get(Object.getPrototypeOf(HistFacet.prototype), 'toString', this).call(this, 'type=hist/range=' + this.range());
    }
  }]);

  return HistFacet;
})(Facet);

var RangeFacet = (function (_Facet3) {
  function RangeFacet(options) {
    _classCallCheck(this, RangeFacet);

    _get(Object.getPrototypeOf(RangeFacet.prototype), 'constructor', this).call(this, options);
  }

  _inherits(RangeFacet, _Facet3);

  _createClass(RangeFacet, [{
    key: 'toString',
    value: function toString() {
      return _get(Object.getPrototypeOf(RangeFacet.prototype), 'toString', this).call(this, 'type=range');
    }
  }]);

  return RangeFacet;
})(Facet);

function enumFacet(options) {
  return new EnumFacet(options);
}

function histFacet(options) {
  return new HistFacet(options);
}

function rangeFacet(options) {
  return new RangeFacet(options);
}