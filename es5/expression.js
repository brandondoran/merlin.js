'use strict';

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.expression = expression;
exports.andExpression = andExpression;
exports.orExpression = orExpression;

var _checkConstructor$RE1 = require('./helpers');

'use strict';

var Expression = (function () {
  function Expression(options) {
    _classCallCheck(this, Expression);

    var field = options.field;
    var operator = options.operator;
    var value = options.value;

    if (!field) {
      throw new Error('Expression#field is required.');
    }
    if (!operator) {
      throw new Error('Expression#operator is required.');
    }
    if (!value) {
      throw new Error('Expression#value is required.');
    }
    if (!_checkConstructor$RE1.checkConstructor(field, String)) {
      throw new Error('Expression#field must be a string.');
    }
    if (!_checkConstructor$RE1.RE1.test(field)) {
      throw new Error('Expression#field can only contain a-z, 0-9, and underscores, and must start with a lowercase letter.');
    }
    if (!_checkConstructor$RE1.checkConstructor(value, String, Number)) {
      throw new Error('Expression#value must be a string or a number.');
    }
    this.field = field;
    this.operator = operator;
    this.value = value;
  }

  _createClass(Expression, [{
    key: 'toString',
    value: function toString() {
      var rhs = undefined,
          op = this.operator,
          val = this.value;
      switch (op) {
        case '=':
          rhs = '' + val;break;
        case '!=':
          rhs = '!' + val;break;
        case '<':
          rhs = '(:' + val + ')';break;
        case '>':
          rhs = '(' + val + ':)';break;
        case '<=':
          rhs = '(:' + val + ']';break;
        case '>=':
          rhs = '[' + val + ':)';break;
        default:
          throw new Error('Expression#operator must be one of the following: =, !=, <, >, <=, or >=.');
      }
      return '' + this.field + ':' + rhs;
    }
  }]);

  return Expression;
})();

var AndExpression = (function (_Expression) {
  function AndExpression(options) {
    _classCallCheck(this, AndExpression);

    _get(Object.getPrototypeOf(AndExpression.prototype), 'constructor', this).call(this, options);
  }

  _inherits(AndExpression, _Expression);

  _createClass(AndExpression, [{
    key: 'toString',
    value: function toString() {
      return ',' + _get(Object.getPrototypeOf(AndExpression.prototype), 'toString', this).call(this);
    }
  }]);

  return AndExpression;
})(Expression);

var OrExpression = (function (_Expression2) {
  function OrExpression(options) {
    _classCallCheck(this, OrExpression);

    _get(Object.getPrototypeOf(OrExpression.prototype), 'constructor', this).call(this, options);
  }

  _inherits(OrExpression, _Expression2);

  _createClass(OrExpression, [{
    key: 'toString',
    value: function toString() {
      return '|' + _get(Object.getPrototypeOf(OrExpression.prototype), 'toString', this).call(this);
    }
  }]);

  return OrExpression;
})(Expression);

function expression(options) {
  return new Expression(options);
}

function andExpression(options) {
  return new AndExpression(options);
}

function orExpression(options) {
  return new OrExpression(options);
}