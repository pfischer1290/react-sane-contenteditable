import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutProperties from "@babel/runtime/helpers/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _objectSpread from "@babel/runtime/helpers/objectSpread";
import React, { Component } from 'react';
import PropTypes from 'prop-types';

var reduceTargetKeys = function reduceTargetKeys(target, keys, predicate) {
  return Object.keys(target).reduce(predicate, {});
};

var omit = function omit() {
  var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var keys = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  return reduceTargetKeys(target, keys, function (acc, key) {
    return keys.some(function (omitKey) {
      return omitKey === key;
    }) ? acc : _objectSpread({}, acc, _defineProperty({}, key, target[key]));
  });
};

var pick = function pick() {
  var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var keys = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  return reduceTargetKeys(target, keys, function (acc, key) {
    return keys.some(function (pickKey) {
      return pickKey === key;
    }) ? _objectSpread({}, acc, _defineProperty({}, key, target[key])) : acc;
  });
};

var isEqual = function isEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
};

var propTypes = {
  content: PropTypes.string,
  editable: PropTypes.bool,
  focus: PropTypes.bool,
  maxLength: PropTypes.number,
  multiLine: PropTypes.bool,
  sanitise: PropTypes.bool,
  caretPosition: PropTypes.oneOf(['start', 'end']),
  tagName: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  // The element to make contenteditable. Takes an element string ('div', 'span', 'h1') or a styled component
  innerRef: PropTypes.func,
  onBlur: PropTypes.func,
  onKeyDown: PropTypes.func,
  onPaste: PropTypes.func,
  onChange: PropTypes.func,
  styled: PropTypes.bool // If element is a styled component (uses innerRef instead of ref)

};
var defaultProps = {
  content: '',
  editable: true,
  focus: false,
  maxLength: Infinity,
  multiLine: false,
  sanitise: true,
  caretPosition: null,
  tagName: 'div',
  innerRef: function innerRef() {},
  onBlur: function onBlur() {},
  onKeyDown: function onKeyDown() {},
  onPaste: function onPaste() {},
  onChange: function onChange() {},
  styled: false
};

var ContentEditable =
/*#__PURE__*/
function (_Component) {
  _inherits(ContentEditable, _Component);

  function ContentEditable(props) {
    var _this;

    _classCallCheck(this, ContentEditable);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ContentEditable).call(this));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_onChange", function (ev) {
      var value = _this.sanitiseValue(ev.target.innerText);

      if (_this.state.value !== value) {
        _this.setState({
          value: value
        }, function () {
          _this.props.onChange(ev, _this.state.value);

          console.log('_onChange', _this.state.value, value);
        });
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_onPaste", function (ev) {
      var maxLength = _this.props.maxLength;
      ev.preventDefault();
      var text = ev.clipboardData.getData('text').substr(0, maxLength);
      document.execCommand('insertText', false, text);

      _this.props.onPaste(ev);
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_onBlur", function (ev) {
      _this.setState({
        value: _this.sanitiseValue(ev.target.innerText)
      }, function () {
        _this.props.onChange(ev, _this.state.value);

        _this.props.onBlur(ev);
      });
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_onKeyDown", function (ev) {
      var _this$props = _this.props,
          maxLength = _this$props.maxLength,
          multiLine = _this$props.multiLine;
      var value = ev.target.innerText; // return key

      if (!multiLine && ev.keyCode === 13) {
        ev.preventDefault();
        ev.currentTarget.blur(); // Call onKeyUp directly as ev.preventDefault() means that it will not be called

        _this._onKeyUp(ev);
      } // Ensure we don't exceed `maxLength` (keycode 8 === backspace)


      if (maxLength && !ev.metaKey && ev.which !== 8 && value.replace(/\s\s/g, ' ').length >= maxLength) {
        ev.preventDefault(); // Call onKeyUp directly as ev.preventDefault() means that it will not be called

        _this._onKeyUp(ev);
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_onKeyUp", function (ev) {
      // Call prop.onKeyDown callback from the onKeyUp event to mitigate both of these issues:
      // Access to Synthetic event: https://github.com/ashleyw/react-sane-contenteditable/issues/14
      // Current value onKeyDown: https://github.com/ashleyw/react-sane-contenteditable/pull/6
      // this._onKeyDown can't be moved in it's entirety to onKeyUp as we lose the opportunity to preventDefault
      _this.props.onKeyDown(ev, ev.target.innerText);
    });

    _this.state = {
      value: _this.sanitiseValue(props.content)
    };
    return _this;
  }

  _createClass(ContentEditable, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.setFocus();
      this.setCaret();
    } // shouldComponentUpdate(nextProps) {
    //   const propKeys = Object.keys(nextProps);
    //   return !isEqual(pick(nextProps, propKeys), pick(this.props, propKeys));
    // }

  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      this.setValue();
      this.setFocus();
      this.setCaret();
    }
  }, {
    key: "setValue",
    value: function setValue() {
      var content = this.props.content;

      if (content !== this.sanitiseValue(this.state.value)) {
        this.setState({
          value: content
        });
      }
    }
  }, {
    key: "setFocus",
    value: function setFocus() {
      if (this.props.focus && this._element) {
        this._element.focus();
      }
    }
  }, {
    key: "setCaret",
    value: function setCaret() {
      var caretPosition = this.props.caretPosition;

      if (caretPosition && this._element) {
        var value = this.state.value;
        var offset = value.length && caretPosition === 'end' ? 1 : 0;
        var range = document.createRange();
        var selection = window.getSelection();
        range.setStart(this._element, offset);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }, {
    key: "sanitiseValue",
    value: function sanitiseValue(value) {
      var _this$props2 = this.props,
          maxLength = _this$props2.maxLength,
          multiLine = _this$props2.multiLine,
          sanitise = _this$props2.sanitise;

      if (!sanitise) {
        return value;
      }

      var doubleWhitespace = multiLine ? /[\t\v\f\r ]+/g : /\s+/g;
      return value.replace(/&nbsp;|[\u00a0\u2000-\u200b\u2028-\u2029\u202e-\u202f\u3000]/g, ' ').replace(doubleWhitespace, ' ').split('\n').map(function (line) {
        return line.trim();
      }).join('\n').replace(/\n{3,}/g, '\n\n') // replace 3+ line breaks with two
      .trim().substr(0, maxLength);
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props3 = this.props,
          Element = _this$props3.tagName,
          editable = _this$props3.editable,
          styled = _this$props3.styled,
          props = _objectWithoutProperties(_this$props3, ["tagName", "editable", "styled"]);

      return React.createElement(Element, _extends({}, omit(props, Object.keys(propTypes)), styled ? {
        innerRef: function innerRef(c) {
          _this2._element = c;
          props.innerRef(c);
        }
      } : {
        ref: function ref(c) {
          _this2._element = c;
          props.innerRef(c);
        }
      }, {
        style: _objectSpread({
          whiteSpace: 'pre-wrap'
        }, props.style),
        contentEditable: editable,
        dangerouslySetInnerHTML: {
          __html: this.state.value
        },
        onBlur: this._onBlur,
        onInput: this._onChange,
        onKeyDown: this._onKeyDown,
        onKeyUp: this._onKeyUp,
        onPaste: this._onPaste
      }));
    }
  }]);

  return ContentEditable;
}(Component);

ContentEditable.defaultProps = defaultProps;
export default ContentEditable;