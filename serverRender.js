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

    mount.serverRenderCache = cache
    mount.refreshify = cache.refreshify

    return renderUntilAllLoaded(mount, cache, {maxRenders: 10})
  }
}

function renderUntilAllLoaded(mount, cache, {maxRenders} = {}) {
  if (maxRenders <= 0) {
    throw new Error('page could not load all resources')
  }

  var vdom
  var html

  render(mount, () => {
    vdom = toVdom(mount.render())
    html = vdomToHtml(vdom)
  })

  if (cache.loadPromises.length) {
    return cache.loaded().then(() => {
      return renderUntilAllLoaded(mount, cache, {maxRenders: maxRenders - 1})
    })
  } else {
    return Promise.resolve({
      vdom: vdom,
      html: html,
      data: cache.data
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
