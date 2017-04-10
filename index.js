var rendering = require('./rendering')
var render = require('./render')
var Component = require('./component')

exports.html = rendering.html
exports.html.refreshify = render.refreshify
exports.rawHtml = rendering.rawHtml
exports.jsx = rendering.jsx
exports.attach = rendering.attach
exports.replace = rendering.replace
exports.append = rendering.append
exports.appendVDom = rendering.appendVDom
exports.binding = require('./binding')
exports.meta = require('./meta')
exports.refreshify = render.refreshify
exports.norefresh = require('./refreshEventResult').norefresh
exports.join = require('./join')
exports.component = function (model) {
  return new Component(model, {component: true})
}

exports.currentRender = render.currentRender
