var vdomToHtml = require('vdom-to-html')
var runRender = require('./runRender')

var noMount = {
  rerenderViewModel: function() {},
  rerender: function() {}
}

module.exports = function(render) {
  return vdomToHtml(runRender(noMount, render))
}
