require('babel-polyfill');
module.exports = require('./dist').default;
module.exports.LimitRule = require('./dist').LimitRule;