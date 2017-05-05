var rendering = require('./rendering')
var render = require('./render')
var viewComponent = require('./viewComponent')
var deprecations = require('./deprecations')

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
exports.viewComponent = viewComponent
exports.component = function (model) {
  deprecations.viewComponent('hyperdom.component is deprecated, use hyperdom.viewComponent instead')
  return viewComponent(model)
}

exports.currentRender = render.currentRender
