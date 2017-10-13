'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.doRequest = undefined;

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _zlib = require('zlib');

var _zlib2 = _interopRequireDefault(_zlib);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function nrequest(options) {
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

var doRequest = exports.doRequest = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(options) {
        var data;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.prev = 0;
                        _context.next = 3;
                        return nrequest(options);

                    case 3:
                        data = _context.sent;
                        return _context.abrupt('return', { err: null, data: data });

                    case 7:
                        _context.prev = 7;
                        _context.t0 = _context['catch'](0);
                        return _context.abrupt('return', { err: _context.t0, data: null });

                    case 10:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined, [[0, 7]]);
    }));

    return function doRequest(_x) {
        return _ref.apply(this, arguments);
    };
}();