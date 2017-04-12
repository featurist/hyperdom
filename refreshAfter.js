var render = require('./render')
var refreshEventResult = require('./refreshEventResult')

module.exports = function (promise) {
  refreshEventResult(promise, render.currentRender().mount, {refresh: 'promise'})
}
