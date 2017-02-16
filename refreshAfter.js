var deprecations = require('./deprecations');
var refreshify = require('./refreshify');

module.exports = function(promise) {
  deprecations.refreshAfter('hyperdom.html.refreshAfter is deprecated');
  refreshify.refreshAfterEvent(promise, undefined, {refresh: 'promise'})
}
