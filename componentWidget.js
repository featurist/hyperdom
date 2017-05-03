var VText = require('virtual-dom/vnode/vtext.js')
var domComponent = require('./domComponent')
var render = require('./render')
var deprecations = require('./deprecations')

function ComponentWidget (state, vdom) {
  if (!vdom) {
    throw new Error('hyperdom.html.component([options], vdom) expects a vdom argument')
  }

  this.state = state
  this.key = state.key
  var currentRender = render.currentRender()

  if (typeof vdom === 'function') {
    this.render = function () {
      if (currentRender && state.on) {
        currentRender.transformFunctionAttribute = function (key, value) {
          return state.on(key.replace(/^on/, ''), value)
        }
      }
      return vdom.apply(this.state, arguments)
    }
    this.canRefresh = true
  } else {
    vdom = vdom || new VText('')
    this.render = function () {
      return vdom
    }
  }
  this.cacheKey = state.cacheKey
  this.component = domComponent.create()

  var renderFinished = currentRender && currentRender.finished
  if (renderFinished) {
    this.afterRender = function (fn) {
      renderFinished.then(fn)
    }
  } else {
    this.afterRender = function () {}
  }
}

ComponentWidget.prototype.type = 'Widget'

ComponentWidget.prototype.init = function () {
  var self = this

  if (self.state.onbeforeadd) {
    self.state.onbeforeadd()
  }

  var vdom = this.render(this)
  if (vdom instanceof Array) {
    throw new Error('vdom returned from component cannot be an array')
  }

  var element = this.component.create(vdom)

  if (self.state.onadd) {
    this.afterRender(function () {
      self.state.onadd(element)
    })
  }

  if (self.state.detached) {
    return document.createTextNode('')
  } else {
    return element
  }
}

ComponentWidget.prototype.update = function (previous) {
  var self = this

  var refresh = !this.cacheKey || this.cacheKey !== previous.cacheKey

  if (refresh) {
    if (self.state.onupdate) {
      this.afterRender(function () {
        self.state.onupdate(self.component.element)
      })
    }
  }

  this.component = previous.component

  if (previous.state && this.state) {
    var keys = Object.keys(this.state)
    for (var n = 0; n < keys.length; n++) {
      var key = keys[n]
      previous.state[key] = self.state[key]
    }
    this.state = previous.state
  }

  if (refresh) {
    var element = this.component.update(this.render(this))

    if (self.state.detached) {
      return document.createTextNode('')
    } else {
      return element
    }
  }
}

ComponentWidget.prototype.refresh = function () {
  this.component.update(this.render(this))
  if (this.state.onupdate) {
    this.state.onupdate(this.component.element)
  }
}

ComponentWidget.prototype.refresh = ComponentWidget.prototype.refresh

ComponentWidget.prototype.destroy = function (element) {
  var self = this

  if (self.state.onremove) {
    this.afterRender(function () {
      self.state.onremove(element)
    })
  }

  this.component.destroy()
}

module.exports = function (state, vdom) {
  deprecations.component('hyperdom.html.component is deprecated, please use hyperdom.viewComponent')
  if (typeof state === 'function') {
    return new ComponentWidget({}, state)
  } else if (state.constructor === Object) {
    return new ComponentWidget(state, vdom)
  } else {
    return new ComponentWidget({}, state)
  }
}

module.exports.ComponentWidget = ComponentWidget
