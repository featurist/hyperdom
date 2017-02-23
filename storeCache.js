module.exports = StoreCache

function StoreCache() {
  this.data = {}
  this.loadPromises = []

  var self = this
  this.refreshify = function(fn) {
    return function() {
      var result = fn.apply(this, arguments)
      if (result && typeof result.then === 'function') {
        self.loadPromises.push(result)
      }
    }
  }
}

StoreCache.prototype.cache = function(key, loadFn) {
  var self = this

  var loadPromise = loadFn().then(function (data) {
    return self.data[key] = data
  })

  return loadPromise
}

StoreCache.prototype.loaded = function() {
  return Promise.all(this.loadPromises).then(() => {
    this.loadPromises = []
  })
}
