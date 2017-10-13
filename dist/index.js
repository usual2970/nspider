'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HtmlElement = function HtmlElement(_ref) {
	var tag = _ref.tag;

	_classCallCheck(this, HtmlElement);

	this.tag = tag;
};

var Request = function Request(_ref2) {
	var tag = _ref2.tag;

	_classCallCheck(this, Request);

	this.tag = tag;
};

var Response = function Response(_ref3) {
	var tag = _ref3.tag;

	_classCallCheck(this, Response);

	this.tag = tag;
};

var nspider = function () {
	function nspider(_ref4) {
		var name = _ref4.name;

		_classCallCheck(this, nspider);

		this.name = name;
		this.htmlCallBacks = {};
		this.requestCallBacks = [];
		this.responseCallBacks = [];
	}

	_createClass(nspider, [{
		key: 'visit',
		value: function visit(url) {
			var tag = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
		}
	}, {
		key: 'get',
		value: function get() {}
	}, {
		key: 'post',
		value: function post() {}
	}, {
		key: 'onHtml',
		value: function onHtml(selector, cb) {
			this.htmlCallBacks[selector] = cb;
		}
	}, {
		key: 'onRequest',
		value: function onRequest(cb) {
			this.requestCallBacks.push(cb);
		}
	}, {
		key: 'onResponse',
		value: function onResponse(cb) {
			this.responseCallBacks.push(cb);
		}
	}]);

	return nspider;
}();

exports.default = nspider;