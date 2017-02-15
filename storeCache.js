module.exports = StoreCache

function StoreCache() {
  this.data = {}
  this.loadPromises = []
}

StoreCache.refreshify = function(fn) {
  return function() {
    var result = fn.apply(this, arguments)
    if (result && typeof result.then === 'function' && typeof result.waitForHyperdomPromise === 'function') {
      result.waitForHyperdomPromise()
    }
  }
}

StoreCache.prototype.cache = function(key, loadFn) {
  var self = this

  function waitForHyperdomPromise() {
    self.loadPromises.push(this)
  }

  var loadPromise = loadFn().then(function (data) {
    return self.data[key] = data
  })

  return modifyPromiseChain(loadPromise, function (p) {
    p.waitForHyperdomPromise = waitForHyperdomPromise
  })
}

function modifyPromiseChain(promise, modify) {
  modify(promise)

  var then = promise.then;

  promise.then = function () {
    var p = then.apply(this, arguments);
    modifyPromiseChain(p, modify);
    return p;
  };

  return promise
}

StoreCache.prototype.loaded = function() {
  return Promise.all(this.loadPromises)
}
