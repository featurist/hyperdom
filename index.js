var rendering = require('./rendering');

exports.html = rendering.html;
exports.attach = rendering.attach;
exports.replace = rendering.replace;
exports.append = rendering.append;

exports.bind = require('./oldbind');
exports.binding = rendering.binding;

var windowEvents = require('./windowEvents');

exports.html.window = function (attributes, vdom) {
  return windowEvents(attributes, vdom, rendering.refreshifyEventHandler);
};

exports.html.rawHtml = require('./rawHtml');
exports.html.component = require('./component');
exports.html.promise = require('./promise');
exports.html.animation = require('./animation');
exports.html.router = require('./router').router;
exports.html.page = require('./router').page;
