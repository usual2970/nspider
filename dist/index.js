'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.HtmlElement = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _request = require('./request.js');

var _request2 = _interopRequireDefault(_request);

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HtmlElement = exports.HtmlElement = function HtmlElement(_ref) {
	var tag = _ref.tag,
	    $ = _ref.$;

	_classCallCheck(this, HtmlElement);

	this.tag = tag;
	this.$ = $;
};

var Request = function Request(_ref2) {
	var tag = _ref2.tag,
	    requestOption = _ref2.requestOption,
	    url = _ref2.url;

	_classCallCheck(this, Request);

	this.tag = tag;
	this.requestOption = requestOption;
	this.url = url;
};

var Response = function Response(_ref3) {
	var tag = _ref3.tag,
	    responseData = _ref3.responseData;

	_classCallCheck(this, Response);

	this.tag = tag;
	this.data = responseData;
};

var nspider = function () {
	function nspider(_ref4) {
		var name = _ref4.name,
		    _ref4$headers = _ref4.headers,
		    headers = _ref4$headers === undefined ? {} : _ref4$headers;

		_classCallCheck(this, nspider);

		this.name = name;
		this.htmlCallBacks = new Map();
		this.requestCallBacks = [];
		this.responseCallBacks = [];
		this.headers = headers;
		this.nrequest = new _request2.default();
	}

	_createClass(nspider, [{
		key: 'visit',
		value: function visit(url) {
			var tag = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

			this.scrape(url, 'GET', tag);
		}
	}, {
		key: 'post',
		value: function post(url, tag) {
			this.scrape(url, 'POST', tag);
		}
	}, {
		key: 'scrape',
		value: function scrape(url, method) {
			var _this = this;

			var tag = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';


			var options = {};

			options.method = method;
			options.headers = this.headers;
			options.url = url;

			if (this.requestCallBacks.length > 0) {
				var req = new Request({ tag: tag, requestOption: options, url: url });
				this.handleRequest(req);
			}

			var rs = this.nrequest.doRequest(options);
			var that = this;
			rs.then(function (data) {

				if (_this.responseCallBacks.length > 0) {
					var res = new Response({ tag: tag, responseData: data });
					that.handleResponse(res);
				}
				if (_this.htmlCallBacks.size > 0) {
					var $ = _cheerio2.default.load(data.data);
					that.handleHtml({ tag: tag, $: $ });
				}
			});
		}
	}, {
		key: 'setHeaders',
		value: function setHeaders(headers) {
			for (var key in headers) {
				this.setHeader(key, headers[key]);
			}

			return this;
		}
	}, {
		key: 'setHeader',
		value: function setHeader(key, val) {
			this.headers[key] = val;
			return this;
		}
	}, {
		key: 'onHtml',
		value: function onHtml(selector, cb) {
			this.htmlCallBacks.set(selector, cb);
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
	}, {
		key: 'handleRequest',
		value: function handleRequest() {
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = this.requestCallBacks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var cb = _step.value;
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}
		}
	}, {
		key: 'handleResponse',
		value: function handleResponse() {
			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = this.responseCallBacks[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var cb = _step2.value;
				}
			} catch (err) {
				_didIteratorError2 = true;
				_iteratorError2 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion2 && _iterator2.return) {
						_iterator2.return();
					}
				} finally {
					if (_didIteratorError2) {
						throw _iteratorError2;
					}
				}
			}
		}
	}, {
		key: 'handleHtml',
		value: function handleHtml(_ref5) {
			var tag = _ref5.tag,
			    $ = _ref5.$;
			var _iteratorNormalCompletion3 = true;
			var _didIteratorError3 = false;
			var _iteratorError3 = undefined;

			try {
				for (var _iterator3 = this.htmlCallBacks[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
					var _step3$value = _slicedToArray(_step3.value, 2),
					    selector = _step3$value[0],
					    cb = _step3$value[1];

					var objects = $(selector);
					for (var i = 0; i < objects.length; i++) {
						var element = new HtmlElement({ tag: tag, $: $(objects[i]) });
						cb(element);
					}
				}
			} catch (err) {
				_didIteratorError3 = true;
				_iteratorError3 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion3 && _iterator3.return) {
						_iterator3.return();
					}
				} finally {
					if (_didIteratorError3) {
						throw _iteratorError3;
					}
				}
			}
		}
	}]);

	return nspider;
}();

exports.default = nspider;