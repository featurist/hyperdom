var rendering = require('./rendering');

exports.html = rendering.html;
exports.jsx = rendering.jsx;
exports.attach = rendering.attach;
exports.replace = rendering.replace;
exports.append = rendering.append;
exports.merge = rendering.merge;
exports.appendVDom = rendering.appendVDom;
exports.merge = rendering.merge;
exports.binding = rendering.binding;
exports.meta = rendering.html.meta;
exports.refreshify = rendering.html.refreshify;
exports.norefresh = rendering.html.norefresh;

exports.currentRender = function () {
  return exports._currentRender;
};
