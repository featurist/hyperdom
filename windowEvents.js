var domComponent = require('./domComponent')
var rendering = require('./rendering')
var VText = require('virtual-dom/vnode/vtext.js')

function WindowWidget (attributes) {
  this.attributes = attributes
  this.vdom = new VText('')
  this.component = domComponent.create()

  var self = this
  this.cache = {}
  Object.keys(this.attributes).forEach(function (key) {
    self.cache[key] = rendering.html.refreshify(self.attributes[key])
  })
}

WindowWidget.prototype.type = 'Widget'

WindowWidget.prototype.init = function () {
  applyPropertyDiffs(window, {}, this.attributes, {}, this.cache)
  return (this.element = document.createTextNode(''))
}

function uniq (array) {
  var sortedArray = array.slice()
  sortedArray.sort()

  var last

  for (var n = 0; n < sortedArray.length;) {
    var current = sortedArray[n]

    if (last === current) {
      sortedArray.splice(n, 1)
    } else {
      n++
    }
    last = current
  }

  return sortedArray
}

function applyPropertyDiffs (element, previous, current, previousCache, currentCache) {
  uniq(Object.keys(previous).concat(Object.keys(current))).forEach(function (key) {
    if (/^on/.test(key)) {
      var event = key.slice(2)

      var prev = previous[key]
      var curr = current[key]
      var refreshPrev = previousCache[key]
      var refreshCurr = currentCache[key]

      if (prev !== undefined && curr === undefined) {
        element.removeEventListener(event, refreshPrev)
      } else if (prev !== undefined && curr !== undefined && prev !== curr) {
        element.removeEventListener(event, refreshPrev)
        element.addEventListener(event, refreshCurr)
      } else if (prev === undefined && curr !== undefined) {
        element.addEventListener(event, refreshCurr)
      }
    }
  })
}

WindowWidget.prototype.update = function (previous) {
  applyPropertyDiffs(window, previous.attributes, this.attributes, previous.cache, this.cache)
  this.component = previous.component
  return this.element
}

WindowWidget.prototype.destroy = function () {
  applyPropertyDiffs(window, this.attributes, {}, this.cache, {})
}

module.exports = function (attributes) {
  return new WindowWidget(attributes)
}
