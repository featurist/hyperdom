var hyperdomMeta = require('./meta')
var render = require('./render')
var Vtext = require('virtual-dom/vnode/vtext.js')
var debuggingProperties = require('./debuggingProperties')

function Component (model, options) {
  this.isViewComponent = options && options.hasOwnProperty('viewComponent') && options.viewComponent
  this.model = model
  this.key = model.renderKey
  this.component = undefined
}

Component.prototype.type = 'Widget'

Component.prototype.init = function () {
  var self = this

  var vdom = this.render()

  var meta = hyperdomMeta(this.model)
  meta.components.add(this)

  var currentRender = render.currentRender()
  this.component = currentRender.mount.createDomComponent()
  var element = this.component.create(vdom)

  if (self.model.detached) {
    return document.createTextNode('')
  } else {
    return element
  }
}

function beforeUpdate (model, element) {
  if (model.onbeforeupdate) {
    model.onbeforeupdate(element)
  }

  if (model.onbeforerender) {
    model.onbeforerender(element)
  }
}

function afterUpdate (model, element, oldElement) {
  if (model.onupdate) {
    model.onupdate(element, oldElement)
  }

  if (model.onrender) {
    model.onrender(element, oldElement)
  }
}

Component.prototype.update = function (previous) {
  var self = this

  if (this.isViewComponent) {
    var keys = Object.keys(this.model)
    for (var n = 0; n < keys.length; n++) {
      var key = keys[n]
      previous.model[key] = self.model[key]
    }
    this.model = previous.model
  }

  this.component = previous.component
  var oldElement = this.component.element

  var element = this.component.update(this.render(oldElement))

  if (self.model.detached) {
    return document.createTextNode('')
  } else {
    return element
  }
}

Component.prototype.renderModel = function (oldElement) {
  var self = this
  var model = this.model
  var currentRender = render.currentRender()
  currentRender.mount.setupModelComponent(model)

  if (!oldElement) {
    if (self.model.onbeforeadd) {
      self.model.onbeforeadd()
    }
    if (self.model.onbeforerender) {
      self.model.onbeforerender()
    }

    if (self.model.onadd || self.model.onrender) {
      currentRender.finished.then(function () {
        if (self.model.onadd) {
          self.model.onadd(self.component.element)
        }
        if (self.model.onrender) {
          self.model.onrender(self.component.element)
        }
      })
    }
  } else {
    beforeUpdate(model, oldElement)

    if (model.onupdate || model.onrender) {
      currentRender.finished.then(function () {
        afterUpdate(model, self.component.element, oldElement)
      })
    }
  }

  var vdom = typeof model.render === 'function' ? model.render() : new Vtext(JSON.stringify(model))

  if (vdom instanceof Array) {
    throw new Error('vdom returned from component cannot be an array')
  }

  return debuggingProperties(vdom, model)
}

Component.prototype.render = function (oldElement) {
  var model = this.model

  var meta = hyperdomMeta(model)
  meta.lastRenderId = render.currentRender().mount.renderId

  if (typeof model.renderCacheKey === 'function') {
    var key = model.renderCacheKey()
    if (key !== undefined && meta.cacheKey === key && meta.cachedVdom) {
      return meta.cachedVdom
    } else {
      meta.cacheKey = key
      return (meta.cachedVdom = this.renderModel(oldElement))
    }
  } else {
    return this.renderModel(oldElement)
  }
}

Component.prototype.refresh = function () {
  var currentRender = render.currentRender()
  if (currentRender.mount.isComponentInDom(this.model)) {
    var oldElement = this.component.element
    beforeUpdate(this.model, oldElement)
    this.component.update(this.render())
    afterUpdate(this.model, this.component.element, oldElement)
  }
}

Component.prototype.destroy = function (element) {
  var self = this

  var meta = hyperdomMeta(this.model)
  meta.components.delete(this)

  if (self.model.onbeforeremove) {
    self.model.onbeforeremove(element)
  }

  if (self.model.onremove) {
    var currentRender = render.currentRender()
    currentRender.finished.then(function () {
      self.model.onremove(element)
    })
  }

  this.component.destroy()
}

module.exports = Component
