var hyperdomMeta = require('./meta')
var runRender = require('./render')
var domComponent = require('./domComponent')
var Set = require('./set')
var refreshEventResult = require('./refreshEventResult')

var lastId = 0

function Mount (model, options) {
  var win = (options && options.window) || window
  var router = typeof options === 'object' && options.hasOwnProperty('router') ? options.router : undefined
  this.requestRender = (options && options.requestRender) || win.requestAnimationFrame || win.setTimeout

  this.document = (options && options.document) || document
  this.model = model

  this.renderQueued = false
  this.mountRenderRequested = false
  this.componentRendersRequested = undefined
  this.id = ++lastId
  this.renderId = 0
  this.mounted = true
  this.router = router
}

Mount.prototype.refreshify = function (fn, options) {
  if (!fn) {
    return fn
  }

  if (options && (options.norefresh === true || options.refresh === false)) {
    return fn
  }

  var self = this

  return function () {
    var result = fn.apply(this, arguments)
    return refreshEventResult(result, self, options)
  }
}

Mount.prototype.transformFunctionAttribute = function (key, value) {
  return this.refreshify(value)
}

Mount.prototype.queueRender = function () {
  if (!this.renderQueued) {
    var self = this

    var requestRender = this.requestRender
    this.renderQueued = true

    requestRender(function () {
      self.renderQueued = false

      if (self.mounted) {
        if (self.mountRenderRequested) {
          self.refreshImmediately()
        } else if (self.componentRendersRequested) {
          self.refreshComponentsImmediately()
        }
      }
    })
  }
}

Mount.prototype.createDomComponent = function () {
  return domComponent.create({ document: this.document })
}

Mount.prototype.render = function () {
  if (this.router) {
    return this.router.render(this.model)
  } else {
    return this.model
  }
}

Mount.prototype.refresh = function () {
  this.mountRenderRequested = true
  this.queueRender()
}

Mount.prototype.refreshImmediately = function () {
  var self = this

  runRender(self, function () {
    self.renderId++
    var vdom = self.render()
    self.component.update(vdom)
    self.mountRenderRequested = false
  })
}

Mount.prototype.refreshComponentsImmediately = function () {
  var self = this

  runRender(self, function () {
    for (var i = 0, l = self.componentRendersRequested.length; i < l; i++) {
      var w = self.componentRendersRequested[i]
      w.refresh()
    }
    self.componentRendersRequested = undefined
  })
}

Mount.prototype.refreshComponent = function (component) {
  if (!this.componentRendersRequested) {
    this.componentRendersRequested = []
  }

  this.componentRendersRequested.push(component)
  this.queueRender()
}

Mount.prototype.isComponentInDom = function (component) {
  var meta = hyperdomMeta(component)
  return meta.lastRenderId === this.renderId
}

Mount.prototype.setupModelComponent = function (model) {
  var self = this

  var meta = hyperdomMeta(model)

  if (!meta.mount) {
    meta.mount = this
    meta.components = new Set()

    model.refresh = function () {
      self.refresh()
    }

    model.refreshImmediately = function () {
      self.refreshImmediately()
    }

    model.refreshComponent = function () {
      var meta = hyperdomMeta(this)
      meta.components.forEach(function (w) {
        self.refreshComponent(w)
      })
    }

    if (typeof model.onload === 'function') {
      this.refreshify(function () { return model.onload() }, {refresh: 'promise'})()
    }
  }
}

Mount.prototype.detach = function () {
  this.mounted = false
}

Mount.prototype.remove = function () {
  if (this.router) {
    this.router.reset()
  }
  this.component.destroy({removeElement: true})
  this.mounted = false
}

module.exports = Mount
