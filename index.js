var rendering = require('./rendering')
var binding = require('./binding')
var meta = require('./meta');
var render = require('./render')
var refreshEventResult = require('./refreshEventResult')
var Component = require('./component')

exports.html = rendering.html;
exports.html.refreshify = render.refreshify
exports.rawHtml = rendering.rawHtml
exports.jsx = rendering.jsx;
exports.attach = rendering.attach;
exports.replace = rendering.replace;
exports.append = rendering.append;
exports.appendVDom = rendering.appendVDom;
exports.binding = binding;
exports.meta = meta;
exports.refreshify = render.refreshify;
exports.norefresh = refreshEventResult.norefresh;
exports.component = function(model) {
  return new Component(model, {component: true})
}

exports.currentRender = render.currentRender
