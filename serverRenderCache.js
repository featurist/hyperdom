var render = require('./render')

module.exports = function (key, loadFn) {
  var cache = render.currentRender().mount.serverRenderCache || new NoCache()
  return cache.cache(key, loadFn)
}

function NoCache () {
}

NoCache.prototype.cache = function (key, loadFn) {
  return loadFn()
}
