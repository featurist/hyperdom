var vdomToHtml = require('vdom-to-html')
var Mount = require('./mount')
var runRender = require('./render')
var router = require('./router')
var StoreCache = require('./storeCache')
var toVdom = require('./toVdom')

module.exports.hasRoute = function (app, url) {
  return router.hasRoute(app, url)
}

module.exports.render = function (app, url) {
  var renderRequested = false

  var cache = new StoreCache()
  var mount = new Mount(app, {window: {},
    router: router.create({history: new ServerHistory(url)}),
    requestRender: function () {
      renderRequested = true
    }})

  mount.serverRenderCache = cache
  mount.refreshify = cache.refreshify

  function renderUntilAllLoaded (mount, cache, options) {
    var maxRenders = typeof options === 'object' && options.hasOwnProperty('maxRenders') ? options.maxRenders : undefined
    var renders = typeof options === 'object' && options.hasOwnProperty('renders') ? options.renders : 0

    if (renders >= maxRenders) {
      throw new Error('page could not load all resources')
    }

    var vdom
    var html

    renderRequested = false

    runRender(mount, function () {
      vdom = toVdom(mount.render())
      html = vdomToHtml(vdom)
    })

    if (cache.loadPromises.length) {
      return cache.loaded().then(function () {
        return renderUntilAllLoaded(mount, cache, {maxRenders: maxRenders, renders: renders + 1})
      })
    } else if (renderRequested) {
      return renderUntilAllLoaded(mount, cache, {maxRenders: maxRenders, renders: renders + 1})
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

function ServerHistory (url) {
  this._url = url
}

ServerHistory.prototype.url = function () {
  return this._url
}

ServerHistory.prototype.start = function () {}
