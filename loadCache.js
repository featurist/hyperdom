var render = require('./render');

module.exports = function(key, loadFn, setFn) {
  var cache = render.currentRender().mount.loadCache || new NoCache()
  return cache.cache(key, loadFn, setFn)
}

function NoCache() {
}

NoCache.prototype.cache = function(key, loadFn) {
  return loadFn()
}
