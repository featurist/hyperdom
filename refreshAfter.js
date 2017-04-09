var deprecations = require('./deprecations');
var refreshify = require('./render').refreshify;

module.exports = function(promise) {
  deprecations.refreshAfter('hyperdom.html.refreshAfter is deprecated');
  refreshify(function() { return promise }, {refresh: 'promise'})()
}
