var rendering = require('./rendering');
var deprecations = require('./deprecations');

exports.html = rendering.html;
exports.jsx = rendering.jsx;
exports.attach = rendering.attach;
exports.replace = rendering.replace;
exports.append = rendering.append;
exports.appendVDom = rendering.appendVDom;
exports.merge = rendering.merge;
exports.binding = rendering.binding;
exports.refreshify = rendering.html.refreshify;

var windowEvents = require('./windowEvents');

exports.html.window = function (attributes) {
  deprecations.window('plastiq.window is deprecated');
  return windowEvents(attributes);
};

exports.html.component = require('./component');

exports.currentRender = function () {
  return exports._currentRender;
};
