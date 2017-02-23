var vdomToHtml = require('vdom-to-html')
var Mount = require('./mount')
var runRender = require('./render')
var router = require('./router')
var StoreCache = require('./storeCache')
var toVdom = require('./toVdom')

module.exports = function(app, url) {
  if (router.hasRoute(app, url)) {
    return render(app, url)
  }
}

function render(app, url) {
  var renderRequested = false

  var cache = new StoreCache()
  var mount = new Mount(app, {window: {}, router: router.create({history: new ServerHistory(url)}), requestRender: () => {
    renderRequested = true
  }})

  mount.serverRenderCache = cache
  mount.refreshify = cache.refreshify

  function renderUntilAllLoaded(mount, cache, {maxRenders, renders = 0} = {}) {
    if (renders >= maxRenders) {
      throw new Error('page could not load all resources')
    }

    var vdom
    var html

    renderRequested = false

    runRender(mount, () => {
      vdom = toVdom(mount.render())
      html = vdomToHtml(vdom)
    })

    if (cache.loadPromises.length) {
      return cache.loaded().then(() => {
        return renderUntilAllLoaded(mount, cache, {maxRenders, renders: renders + 1})
      })
    } else if (renderRequested) {
      return renderUntilAllLoaded(mount, cache, {maxRenders, renders: renders + 1})
    } else {
      return Promise.resolve({
        vdom: vdom,
        html: html,
        data: cache.data
      })
    }
  }

  return renderUntilAllLoaded(mount, cache, {maxRenders: 10})
}

function ServerHistory(url) {
  this._url = url
}

ServerHistory.prototype.url = function() {
  return this._url
}

ServerHistory.prototype.start = function() {}
