'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _zlib = require('zlib');

var _zlib2 = _interopRequireDefault(_zlib);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Nrequest = function () {
    function Nrequest() {
        _classCallCheck(this, Nrequest);
    }

    _createClass(Nrequest, [{
        key: 'nrequest',
        value: function nrequest(options) {
            var req = (0, _request2.default)(options);

            return new Promise(function (resolve) {

                req.on('response', function (res) {
                    var chunks = [];
                    res.on('data', function (chunk) {
                        chunks.push(chunk);
                    });

                    res.on('end', function () {
                        var buffer = Buffer.concat(chunks);
                        var encoding = res.headers['content-encoding'];
                        if (encoding == 'gzip') {
                            _zlib2.default.gunzip(buffer, function (err, decoded) {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve(decoded && decoded.toString());
                                }
                            });
                        } else if (encoding == 'deflate') {
                            _zlib2.default.inflate(buffer, function (err, decoded) {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve(decoded && decoded.toString());
                                }
                            });
                        } else {
                            resolve(buffer.toString());
                        }
                    });
                });

                req.on('error', function (err) {
                    reject(err);
                });
            });
        }
    }, {
        key: 'doRequest',
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(options) {
                var err, data;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                err = void 0, data = null;
                                _context.prev = 1;
                                _context.next = 4;
                                return this.nrequest(options);

                            case 4:
                                data = _context.sent;
                                _context.next = 10;
                                break;

                            case 7:
                                _context.prev = 7;
                                _context.t0 = _context['catch'](1);

                                err = _context.t0;

                            case 10:
                                return _context.abrupt('return', {
                                    err: err,
                                    data: data
                                });

                            case 11:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[1, 7]]);
            }));

            function doRequest(_x) {
                return _ref.apply(this, arguments);
            }

            return doRequest;
        }()
    }]);

    return Nrequest;
}();

exports.default = Nrequest;