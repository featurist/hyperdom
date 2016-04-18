var rendering = require('./rendering');

exports.html = rendering.html;
exports.attach = rendering.attach;
exports.replace = rendering.replace;
exports.append = rendering.append;
exports.appendVDom = rendering.appendVDom;
exports.merge = rendering.merge;

exports.bind = require('./oldbind');
exports.binding = rendering.binding;

var windowEvents = require('./windowEvents');

exports.html.window = function (attributes) {
  return windowEvents(attributes);
};

exports.html.component = require('./component');
