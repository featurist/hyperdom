var vdomToHtml = require('vdom-to-html')
var toVdom = require('./toVdom')

module.exports = function (_vdom) {
  var vdom = toVdom(_vdom)
  return vdomToHtml(vdom)
}
