var vdomToHtml = require('vdom-to-html')
var Mount = require('./mount')
var render = require('./render')
var router = require('./router')
var StoreCache = require('./storeCache')
var toVdom = require('./toVdom')

module.exports = function(app, url) {
  if (router.hasRoute(app, url)) {
    var cache = new StoreCache()
    var mount = new Mount(app, {window: {}, router: router.create({history: new ServerHistory(url)})})

    mount.loadCache = cache
    mount.refreshify = StoreCache.refreshify

    render(mount, () => mount.render())

    return cache.loaded().then(() => {
      var vdom
      var html

      render(mount, () => {
        vdom = toVdom(mount.render())
        html = vdomToHtml(vdom)
      })

      return {
        vdom: vdom,
        html: html,
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
