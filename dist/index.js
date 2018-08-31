'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.LimitRule = exports.HtmlElement = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _request = require('./request.js');

var _request2 = _interopRequireDefault(_request);

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

var _bottleneck = require('bottleneck');

var _bottleneck2 = _interopRequireDefault(_bottleneck);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HtmlElement = exports.HtmlElement = function HtmlElement(_ref) {
    var tag = _ref.tag,
        $ = _ref.$;

    _classCallCheck(this, HtmlElement);

    this.tag = tag;
    this.$ = $;
};

var LimitRule = exports.LimitRule = function LimitRule(_ref2) {
    var _ref2$maxConnections = _ref2.maxConnections,
        maxConnections = _ref2$maxConnections === undefined ? 0 : _ref2$maxConnections,
        _ref2$delayTime = _ref2.delayTime,
        delayTime = _ref2$delayTime === undefined ? 0 : _ref2$delayTime,
        _ref2$highWater = _ref2.highWater,
        highWater = _ref2$highWater === undefined ? -1 : _ref2$highWater;

    _classCallCheck(this, LimitRule);

    this.maxConcurrent = maxConnections;
    this.minTime = delayTime;
    this.highWater = highWater;
    this.strategy = _bottleneck2.default.strategy.LEAK;
    this.rejectOnDrop = false;
};

var Request = function Request(_ref3) {
    var tag = _ref3.tag,
        requestOption = _ref3.requestOption,
        url = _ref3.url;

    _classCallCheck(this, Request);

    this.tag = tag;
    this.requestOption = requestOption;
    this.url = url;
};

var Response = function Response(_ref4) {
    var tag = _ref4.tag,
        responseData = _ref4.responseData;

    _classCallCheck(this, Response);

    this.tag = tag;
    this.data = responseData;
};

var nspider = function () {
    function nspider(_ref5) {
        var _ref5$name = _ref5.name,
            name = _ref5$name === undefined ? '' : _ref5$name,
            _ref5$headers = _ref5.headers,
            headers = _ref5$headers === undefined ? {} : _ref5$headers;

        _classCallCheck(this, nspider);

        this.name = name;
        this.htmlCallBacks = new Map();
        this.requestCallBacks = [];
        this.responseCallBacks = [];
        this.headers = headers;
        this.nrequest = new _request2.default();
        this.limitRule = new LimitRule({});

        this.limiter = new _bottleneck2.default(this.limitRule.maxConcurrent, this.limitRule.minTime);
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
                var req = new Request({
                    tag: tag,
                    requestOption: options,
                    url: url
                });
                this.handleRequest(req);
            }

            var rs = this.limiter.schedule(this.nrequest.nrequest, options);
            var that = this;
            rs.then(function (data) {

                if (_this.responseCallBacks.length > 0) {
                    var res = new Response({
                        tag: tag,
                        responseData: data
                    });
                    that.handleResponse(res);
                }
                if (_this.htmlCallBacks.size > 0) {
                    var $ = _cheerio2.default.load(data);
                    that.handleHtml({
                        tag: tag,
                        $: $
                    });
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
        key: 'setLimiter',
        value: function setLimiter(limitRule) {
            this.limitRule = limitRule;
            this.limiter = new _bottleneck2.default(this.limitRule.maxConcurrent, this.limitRule.minTime);
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
        value: function handleRequest(req) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.requestCallBacks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var cb = _step.value;

                    cb(req);
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
        value: function handleResponse(res) {
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = this.responseCallBacks[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var cb = _step2.value;

                    cb(res);
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
        value: function handleHtml(_ref6) {
            var tag = _ref6.tag,
                $ = _ref6.$;
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
                        var element = new HtmlElement({
                            tag: tag,
                            $: $(objects[i])
                        });
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