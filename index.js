var rendering = require('./rendering')
var refreshify = require('./refreshify')
var binding = require('./binding')
var meta = require('./meta');

exports.html = rendering.html;
exports.html.refreshify = refreshify
exports.jsx = rendering.jsx;
exports.attach = rendering.attach;
exports.replace = rendering.replace;
exports.append = rendering.append;
exports.appendVDom = rendering.appendVDom;
exports.merge = rendering.merge;
exports.binding = binding;
exports.meta = meta;
exports.refreshify = refreshify;
exports.norefresh = refreshify.norefresh;

exports.currentRender = function () {
  return exports._currentRender;
};
