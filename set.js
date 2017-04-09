if (typeof Set === 'function') {
  module.exports = Set
} else {
  module.exports = function () {
    this.items = []
  }

  module.exports.prototype.add = function (widget) {
    if (this.items.indexOf(widget) === -1) {
      this.items.push(widget)
    }
  }

  module.exports.prototype.delete = function (widget) {
    var i = this.items.indexOf(widget)
    if (i !== -1) {
      this.items.splice(i, 1)
    }
  }

  module.exports.prototype.forEach = function (fn) {
    for (var n = 0; n < this.items.length; n++) {
      fn(this.items[n])
    }
  }
}
