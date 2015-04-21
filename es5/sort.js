'use strict';

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.ascSort = ascSort;
exports.descSort = descSort;

var _checkConstructor$RE1 = require('./helpers');

'use strict';

var Sort = (function () {
  function Sort(options) {
    _classCallCheck(this, Sort);

    var field = options.field;

    if (!field) {
      throw new Error('Sort#field is required.');
    }
    if (!_checkConstructor$RE1.checkConstructor(field, String)) {
      throw new Error('Sort#field must be a string.');
    }
    if (!_checkConstructor$RE1.RE1.test(field)) {
      throw new Error('Sort#field can only contain a-z, 0-9, and underscores, and must start with a lowercase letter.');
    }
    this.field = field;
  }

  _createClass(Sort, [{
    key: 'toString',
    value: function toString(ordering) {
      return '' + this.field + ':' + ordering;
    }
  }]);

  return Sort;
})();

var AscSort = (function (_Sort) {
  function AscSort() {
    _classCallCheck(this, AscSort);

    if (_Sort != null) {
      _Sort.apply(this, arguments);
    }
  }

  _inherits(AscSort, _Sort);

  _createClass(AscSort, [{
    key: 'toString',
    value: function toString() {
      return _get(Object.getPrototypeOf(AscSort.prototype), 'toString', this).call(this, 'asc');
    }
  }]);

  return AscSort;
})(Sort);

var DescSort = (function (_Sort2) {
  function DescSort() {
    _classCallCheck(this, DescSort);

    if (_Sort2 != null) {
      _Sort2.apply(this, arguments);
    }
  }

  _inherits(DescSort, _Sort2);

  _createClass(DescSort, [{
    key: 'toString',
    value: function toString() {
      return _get(Object.getPrototypeOf(DescSort.prototype), 'toString', this).call(this, 'desc');
    }
  }]);

  return DescSort;
})(Sort);

function ascSort(options) {
  return new AscSort(options);
}

function descSort(options) {
  return new DescSort(options);
}