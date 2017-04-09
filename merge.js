var domComponent = require('./domComponent')
var Mount = require('./mount')
var vdomParser = require('vdom-parser')
var render = require('./render')

module.exports = function (element, app, options) {
  if (!element) {
    throw new Error('merge: element must not be null')
  }

  var mount = new Mount(app, options)

  mount.component = domComponent.create(options)
  var serverVdom = vdomParser(element)
  mount.component.merge(serverVdom, element)

  mount.serverRenderCache = new LoadCache(options && options.loadCache)

  render(mount, function () {
    var vdom = mount.render()
    mount.component.update(vdom)
  })

  delete mount.serverRenderCache

  return mount
}

function LoadCache (data) {
  this.data = data
}

LoadCache.prototype.cache = function (key) {
  var data = this.data[key]

  return Promise.resolve(data)
}
