var rendering = require('./rendering');

exports.html = rendering.html;
exports.attach = rendering.attach;

exports.bind = require('./bind');

var windowEvents = require('./windowEvents');

exports.html.window = function (attributes) {
  return windowEvents(attributes, rendering.refreshifyEventHandler);
};

exports.html.rawHtml = require('./rawHtml');
exports.html.component = require('./component');
exports.html.promise = require('./promise');
exports.html.animation = require('./animation');
