module.exports = StoreCache

function StoreCache () {
  this.data = {}
  this.loadPromises = []

  var self = this
  this.refreshify = function (fn) {
    return function () {
      var result = fn.apply(this, arguments)
      if (result && typeof result.then === 'function') {
        self.loadPromises.push(result)
      }
    }
  }
}

StoreCache.prototype.cache = function (key, loadFn) {
  var self = this

  var loadPromise = loadFn().then(function (data) {
    return (self.data[key] = data)
  })

  return modifyPromiseChain(loadPromise, p => {
    if (!this.waitingForLoad) {
      this.loadPromises.push(p)
    }
  })
}

function modifyPromiseChain (promise, modify) {
  modify(promise)

  var then = promise.then
  var _catch = promise.catch

  promise.then = function () {
    var p = then.apply(this, arguments)
    modifyPromiseChain(p, modify)
    return p
  }

  promise.catch = function () {
    var p = _catch.apply(this, arguments)
    modifyPromiseChain(p, modify)
    return p
  }

  return promise
}

StoreCache.prototype.loaded = function () {
  this.waitingForLoad = true
  return Promise.all(this.loadPromises).then(() => {
    this.waitingForLoad = false
    this.loadPromises = []
  })
}
