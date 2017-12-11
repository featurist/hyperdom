var simplePromise = require('./simplePromise')

function runRender (mount, fn) {
  var render = new Render(mount)

  try {
    runRender._currentRender = render

    var vdom = fn()
    render.finished.fulfill()
    return vdom
  } finally {
    runRender._currentRender = undefined
  }
}

function Render (mount) {
  this.finished = simplePromise()
  this.mount = mount
  this.attachment = mount
}

Render.prototype.transformFunctionAttribute = function () {
  return this.mount.transformFunctionAttribute.apply(this.mount, arguments)
}

module.exports = runRender
module.exports.currentRender = currentRender
module.exports.refreshify = refreshify
module.exports.RefreshHook = RefreshHook

function currentRender () {
  return runRender._currentRender || defaultRender
}

var defaultRender = {
  mount: {
    setupModelComponent: function () { },
    refreshify: function (fn) { return fn }
  },

  transformFunctionAttribute: function (key, value) {
    return new RefreshHook(value)
  },

  finished: {
    then: function (fn) {
      fn()
    }
  }
}

function refreshify (fn, options) {
  return runRender.currentRender().mount.refreshify(fn, options)
}

function RefreshHook (handler) {
  this.handler = handler
}

RefreshHook.prototype.hook = function (node, property) {
  node[property] = refreshify(this.handler)
}

RefreshHook.prototype.unhook = function (node, property) {
  node[property] = null
}
