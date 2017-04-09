function SimplePromise () {
  this.listeners = []
}

SimplePromise.prototype.fulfill = function (value) {
  if (!this.isFulfilled) {
    this.isFulfilled = true
    this.value = value
    this.listeners.forEach(function (listener) {
      listener()
    })
  }
}

SimplePromise.prototype.then = function (success) {
  if (this.isFulfilled) {
    success(this.value)
  } else {
    this.listeners.push(success)
  }
}

module.exports = function () {
  return new SimplePromise()
}
