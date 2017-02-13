var deprecations = require('./deprecations');
var refreshify = require('./refreshify');
var render = require('./render')

module.exports = function(promise) {
  deprecations.refreshAfter('hyperdom.html.refreshAfter is deprecated');
  refreshify.refreshAfterEvent(promise, render.currentRender().mount, {refresh: 'promise'})
}
