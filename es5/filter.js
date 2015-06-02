'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports.cnfFilter = cnfFilter;
exports.dnfFilter = dnfFilter;

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _helpers = require('./helpers');

var _expression = require('./expression');

var Filter = (function () {
  function Filter(options) {
    _classCallCheck(this, Filter);

    this.expressions = [];
    this.expressions.push((0, _expression.expression)(options));
  }

  _createClass(Filter, [{
    key: 'and',
    value: function and(options) {
      this.expressions.push((0, _expression.andExpression)(options));
      return this;
    }
  }, {
    key: 'or',
    value: function or(options) {
      this.expressions.push((0, _expression.orExpression)(options));
      return this;
    }
  }, {
    key: 'tag',
    value: function tag(input) {
      if (!(0, _helpers.checkConstructor)(input, String)) {
        throw new Error('Filter tags must be strings.');
      }
      if (!_helpers.RE1.test(input)) {
        throw new Error('Filter tags can only contain a-z, 0-9, and underscores, and must start with a lowercase letter.');
      }
      this._tag = input;
      return this;
    }
  }, {
    key: 'tagString',
    get: function () {
      if (this._tag) {
        return '/tag=' + this._tag;
      }
      return '';
    }
  }, {
    key: 'toString',
    value: function toString() {
      var expressions = this.expressions.reduce(function (result, exp) {
        return result + exp.toString();
      }, '');

      return 'exp=' + expressions + '' + this.tagString;
    }
  }]);

  return Filter;
})();

var CnfFilter = (function (_Filter) {
  function CnfFilter(options) {
    _classCallCheck(this, CnfFilter);

    _get(Object.getPrototypeOf(CnfFilter.prototype), 'constructor', this).call(this, options);
  }

  _inherits(CnfFilter, _Filter);

  _createClass(CnfFilter, [{
    key: 'toString',
    value: function toString() {
      return '' + _get(Object.getPrototypeOf(CnfFilter.prototype), 'toString', this).call(this) + '/type=cnf';
    }
  }]);

  return CnfFilter;
})(Filter);

var DnfFilter = (function (_Filter2) {
  function DnfFilter(options) {
    _classCallCheck(this, DnfFilter);

    _get(Object.getPrototypeOf(DnfFilter.prototype), 'constructor', this).call(this, options);
  }

  _inherits(DnfFilter, _Filter2);

  _createClass(DnfFilter, [{
    key: 'toString',
    value: function toString() {
      return '' + _get(Object.getPrototypeOf(DnfFilter.prototype), 'toString', this).call(this) + '/type=dnf';
    }
  }]);

  return DnfFilter;
})(Filter);

function cnfFilter(options) {
  return new CnfFilter(options);
}

function dnfFilter(options) {
  return new DnfFilter(options);
}