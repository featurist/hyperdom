var Mount = require('./mount')
var render = require('./render')
var router = require('./router')
var StoreCache = require('./storeCache')

module.exports = function(app, url) {
  if (router.hasRoute(app, url)) {
    var cache = new StoreCache()
    var mount = new Mount(app, {window: {}, router: router.create({history: new ServerHistory(url)})})

    mount.loadCache = cache
    mount.refreshify = StoreCache.refreshify

    render(mount, () => mount.render())

    return cache.loaded().then(() => {
      return {
        vdom: render(mount, () => mount.render()),
        data: cache.data
      }
    })
  }
}

function ServerHistory(url) {
  this._url = url
}

ServerHistory.prototype.url = function() {
  return this._url
}

ServerHistory.prototype.start = function() {}
