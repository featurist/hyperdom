var makeBinding = require('./binding')
var refreshify = require('./render').refreshify
var runRender = require('./render')
var refreshAfter = require('./refreshAfter')
var h = require('./rendering').html
var debuggingProperties = require('./debuggingProperties')

function Router (options) {
  this._querystring = typeof options === 'object' && options.hasOwnProperty('querystring') ? options.querystring : new QueryString()
  this.history = typeof options === 'object' && options.hasOwnProperty('history') ? options.history : new PushState()
  this.baseUrl = typeof options === 'object' && options.hasOwnProperty('baseUrl') ? options.baseUrl : undefined
  this._redirectError = new Error('redirect')
}

Router.prototype.reset = function () {
  this.lastUrl = undefined
  this.history.stop()
}

function layoutVdom (vdom, models) {
  return models.reduce(function (vdom, model) {
    if (typeof model.renderLayout === 'function') {
      return debuggingProperties(model.renderLayout(vdom), model)
    } else {
      return debuggingProperties(vdom, model)
    }
  }, vdom)
}

Router.prototype.url = function () {
  var url = this.history.url()
  return removeBaseUrl(this.baseUrl, url)
}

function Location (router, url) {
  this.url = url
  this.lastUrl = router.lastUrl
  this.isNewUrl = url !== this.lastUrl
  this.router = router
  this.currentParentModels = []
  this.routesAttempted = []
}

Location.prototype.push = function (url) {
  this.redirect(url, true)
}

Location.prototype.replace = function (url) {
  this.redirect(url, false)
}

Location.prototype.redirect = function (url, push) {
  if (url !== this.url) {
    this.currentRedirect = {
      isRedirect: true,
      push: push,
      url: url
    }
  }
}

Location.prototype.renderRoutes = function (route) {
  if (route) {
    if (typeof route.routes === 'function') {
      runRender.currentRender().mount.setupModelComponent(route)

      var lastParentModels = this.currentParentModels
      this.currentParentModels = [route].concat(this.currentParentModels)
      var modelVdom = this.renderRoutes(route.routes())
      if (!modelVdom) {
        this.currentParentModels = lastParentModels
      }
      return modelVdom
    } else if (route instanceof Array) {
      var routes = route
      for (var r = 0, l = routes.length; r < l; r++) {
        var arrayVdom = this.renderRoutes(routes[r])

        if (arrayVdom || this.currentRedirect) {
          return arrayVdom
        }
      }

      return
    } else if (typeof route.renderRoute === 'function') {
      this.routesAttempted.push(route)
      return route.renderRoute(this)
    } else if (route.notFound) {
      this.notFoundParentModels = this.currentParentModels
      this.lastNotFound = route.render
      return
    } else if (typeof route === 'function') {
      this.routesAttempted.push(route)
      return route(this)
    }
  }

  throw new Error('expected a route to be a function, an array, or a model. see https://github.com/featurist/hyperdom#routing')
}

Router.prototype.render = function (model) {
  var self = this
  this.history.start({
    refresh: function () {
      if (typeof model.refreshImmediately === 'function') {
        model.refreshImmediately()
      }
    }
  })

  function renderUrl (redirects) {
    var url = self.url()
    var location = new Location(self, url)

    var vdom = location.renderRoutes(model)

    if (location.currentRedirect) {
      var redirect = location.currentRedirect
      if (redirects.length > 10) {
        throw new Error('hyperdom: too many redirects:\n  ' + redirects.join('\n  '))
      }
      redirects.push(redirect.url)
      if (redirect.push) {
        self.push(redirect.url)
      } else {
        self.replace(redirect.url)
      }
      return renderUrl(redirects)
    }

    self.lastUrl = url

    if (!vdom) {
      var parentModels = location.notFoundParentModels || []
      var notFound = location.lastNotFound || renderNotFound
      return layoutVdom(notFound(location), parentModels)
    } else {
      return layoutVdom(vdom, location.currentParentModels)
    }
  }

  return renderUrl([])
}

function removeBaseUrl (baseUrl, url) {
  if (baseUrl) {
    if (url.indexOf(baseUrl) === 0) {
      var path = url.substring(baseUrl.length)
      return path[0] === '/' ? path : '/' + path
    } else {
      return url
    }
  } else {
    return url
  }
}

function addBaseUrl (baseUrl, url) {
  if (baseUrl) {
    if (url === '/') {
      return baseUrl
    } else {
      return baseUrl.replace(/\/$/, '') + '/' + url.replace(/^\//, '')
    }
  } else {
    return url
  }
}

Router.prototype.push = function (url) {
  this.history.push(addBaseUrl(this.baseUrl, url))
}

Router.prototype.replace = function (url) {
  this.history.replace(addBaseUrl(this.baseUrl, url))
}

function renderNotFound (location) {
  var routeDescriptions = location.routesAttempted.map(function (r) {
    if (typeof r !== 'function') {
      return '  ' + r
    }
  }).join('\n')
  return h('pre', h('code', 'no route for: ' + location.url + '\n\navailable routes:\n\n' + routeDescriptions))
}

Router.prototype.notFound = function (render) {
  return {
    notFound: true,
    render: render
  }
}

Router.prototype.route = function (pattern, options) {
  var routeDefinition = new RouteDefinition(pattern, this, options)

  function route () {
    return routeDefinition.route.apply(routeDefinition, arguments)
  }

  route.isActive = routeDefinition.isActive.bind(routeDefinition)
  route.params = routeDefinition.params.bind(routeDefinition)
  route.push = routeDefinition.push.bind(routeDefinition)
  route.replace = routeDefinition.replace.bind(routeDefinition)
  route.href = routeDefinition.href.bind(routeDefinition)
  route.url = routeDefinition.url.bind(routeDefinition)
  if (!(options && options.baseUrl)) {
    route.base = this.route(pattern, {baseUrl: true})
  }

  return route
}

function RouteDefinition (pattern, router, options) {
  var patternVariables = preparePattern(pattern, options)

  this.pattern = patternVariables.pattern
  this.variables = patternVariables.variables
  this.regex = patternVariables.regex

  this.router = router
}

RouteDefinition.prototype.route = function (options) {
  var self = this
  if (typeof options === 'function') {
    return function (location) {
      if (self.matchUrl(location.url)) {
        return options(location)
      }
    }
  } else {
    return new Route(options, this)
  }
}

RouteDefinition.prototype.params = function (_url, _match) {
  var url = _url || this.router.url()
  var match = _match || this.matchUrl(url)
  var query = url.split('?')[1]
  var params = this.router._querystring.parse(query)

  if (match) {
    for (var n = 1; n < match.length; n++) {
      params[this.variables[n - 1]] = match[n]
    }
    return params
  }
}

RouteDefinition.prototype.matchUrl = function (url, matchBase) {
  return this.regex.exec(url.split('?')[0])
}

RouteDefinition.prototype.isActive = function (params) {
  if (params) {
    var url = this.router.url()
    var p = {}
    extend(extend(p, this.params(url)), params)
    return this.router.url() === this.url(p)
  } else {
    return !!this.matchUrl(this.router.url())
  }
}

RouteDefinition.prototype.push = function (params, options) {
  this.router.push(this.url(params))
  if (!(options && options.resetScroll === false)) {
    window.scrollTo(0, 0)
  }
}

RouteDefinition.prototype.replace = function (params) {
  this.router.replace(this.url(params))
}

RouteDefinition.prototype.href = function (params, options) {
  return new HrefAttribute(this, params, options)
}

RouteDefinition.prototype.url = function (_params) {
  var params = _params || {}
  var onlyQueryParams = clone(params)

  var url = this.pattern.replace(/:([a-z_][a-z0-9_]*)\*/gi, function (_, id) {
    var param = params[id]
    delete onlyQueryParams[id]
    return encodeURI(paramToString(param))
  })

  url = url.replace(/:([a-z_][a-z0-9_]*)/gi, function (_, id) {
    var param = params[id]
    delete onlyQueryParams[id]
    return encodeURIComponent(paramToString(param))
  })

  var query = this.router._querystring.stringify(onlyQueryParams)

  if (query) {
    return url + '?' + query
  } else {
    return url
  }
}

function Route (model, definition) {
  this.definition = definition

  var bindings = typeof model.bindings === 'object' ? model.bindings : undefined
  this.bindings = bindings ? bindParams(bindings) : undefined
  this.model = model

  if (!this.model.render && !this.model.redirect && !this.model.routes) {
    throw new Error('expected route options to have either render or redirect function')
  }

  if (typeof model.push === 'function') {
    this.push = model.push
  } else if (model.push instanceof Object) {
    this.push = function (oldParams, newParams) {
      return Object.keys(model.push).some(function (key) {
        return model.push[key] && (oldParams.hasOwnProperty(key) || newParams.hasOwnProperty(key)) && oldParams[key] !== newParams[key]
      })
    }
  } else {
    this.push = function () { return model.push }
  }
}

function bindParams (params) {
  var bindings = {}

  Object.keys(params).forEach(function (key) {
    bindings[key] = makeBinding(params[key], {refresh: 'promise'})
  })

  return bindings
}

Route.prototype.renderRoute = function (location) {
  var match
  if ((match = this.matchUrl(location.url))) {
    return location.isNewUrl
      ? this.set(location, match)
      : this.get(location, match)
  }
}

Route.prototype.matchUrl = function (url) {
  return this.definition.matchUrl(url)
}

Route.prototype.set = function (location, match) {
  var self = this
  var params = this.definition.params(location.url, match)

  location.params = params

  if (this.model.redirect) {
    var redirectUrl = this.model.redirect(params)
    if (redirectUrl) {
      return location.replace(redirectUrl)
    }
  }

  if (this.model.bindings) {
    Object.keys(this.model.bindings).forEach(function (key) {
      var binding = self.bindings[key]

      if (binding && binding.set) {
        refreshAfter(binding.set(params[key]))
      }
    })
  }

  if (this.model.onload) {
    refreshAfter(self.model.onload(location))
  }

  return this.render(location)
}

Route.prototype.get = function (location) {
  var self = this
  var oldParams = this.definition.params(location.url)

  if (this.model.bindings) {
    var params = {}
    Object.keys(this.model.bindings).forEach(function (key) {
      var binding = self.bindings[key]

      if (binding && binding.get) {
        params[key] = binding.get()
      }
    })

    var newUrl = this.definition.url(extend(extend({}, oldParams), params))
    var newParams = this.definition.params(newUrl)
    location.params = newParams
    var push = this.push(oldParams, newParams)
  } else {
    location.params = oldParams
  }

  if (newUrl && newUrl !== location.url) {
    if (push) {
      return location.push(newUrl)
    } else {
      return location.replace(newUrl)
    }
  }

  return this.render(location)
}

Route.prototype.render = function (location) {
  if (typeof this.model.routes === 'function') {
    return location.renderRoutes(this.model.routes(location))
  } else {
    return this.model.render(location)
  }
}

Route.prototype.toString = function () {
  return this.definition.pattern
}

function extend (a, b) {
  if (b) {
    var keys = Object.keys(b)

    for (var k = 0, l = keys.length; k < l; k++) {
      var key = keys[k]
      a[key] = b[key]
    }
  }

  return a
}

function clone (thing) {
  return JSON.parse(JSON.stringify(thing))
}

function paramToString (p) {
  if (p === undefined || p === null) {
    return ''
  } else {
    return p
  }
}

function escapeRegex (pattern) {
  return pattern.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
}

function compilePattern (pattern) {
  var anyRegex = /\\\*/ig
  var splatVariableRegex = /:[a-z\-_]+\\\*/ig
  var variableRegex = /:[-a-z_]+/ig

  return escapeRegex(pattern)
    .replace(splatVariableRegex, '(.*)')
    .replace(anyRegex, '.*')
    .replace(variableRegex, '([^/]*)')
}

function preparePattern (pattern, options) {
  var match
  var variableRegex = new RegExp(':([-a-z_]+)', 'ig')
  var variables = []

  while ((match = variableRegex.exec(pattern))) {
    variables.push(match[1])
  }

  var compiledPattern = compilePattern(pattern)

  return {
    pattern: pattern,
    regex: options && options.baseUrl
      ? new RegExp('^' + compiledPattern + '(?:$|/.*)')
      : new RegExp('^' + compiledPattern + '$'),
    variables: variables
  }
}

function QueryString () {
}

QueryString.prototype.parse = function (search) {
  var params = {}

  if (search) {
    search.split('&').map(function (param) {
      var v = param.split('=').map(decodeURIComponent)
      params[v[0]] = v[1]
    })
  }

  return params
}

QueryString.prototype.stringify = function (paramsObject) {
  var query = Object.keys(paramsObject).map(function (key) {
    var param = paramToString(paramsObject[key])

    if (param !== '') {
      return encodeURIComponent(key) + '=' + encodeURIComponent(param)
    }
  }).filter(function (param) {
    return param
  }).join('&')

  return query
}

var PushState = function () {
}

PushState.prototype.start = function (model) {
  if (this.started) {
    return
  }
  this.started = true

  window.addEventListener('popstate', this.listener = function () {
    model.refresh()

    // hack!
    // Chrome 56.0.2924.87 (64-bit)
    // explanation:
    // when you move back and forward in history the browser will remember the scroll
    // positions at each URL and then restore those scroll positions when you come
    // back to that URL, just like in normal navigation
    // However, the trick is to refresh the page so that it has the correct height
    // before that scroll takes place, which is what we do with model.refreshImmediately()
    // also, it seems that its necessary to call document.body.clientHeight to force it
    // to layout the page before attempting set the scroll position
    document.body.clientHeight // eslint-disable-line no-unused-expressions
  })
}

PushState.prototype.stop = function () {
  this.started = false
  window.removeEventListener('popstate', this.listener)
}

PushState.prototype.url = function () {
  return window.location.pathname + window.location.search
}

PushState.prototype.push = function (url) {
  window.history.pushState(undefined, undefined, url)
}

PushState.prototype.state = function (state) {
  window.history.replaceState(state)
}

PushState.prototype.replace = function (url) {
  window.history.replaceState(undefined, undefined, url)
}

function Hash () {
  this.pushed = 0
}

Hash.prototype.start = function (model) {
  if (this.started) {
    return
  }
  this.started = true

  this.hashchangeListener = function (event) {
    model.refresh()
  }
  hashChangeController().addListener(this.hashchangeListener)
}

Hash.prototype.stop = function () {
  this.started = false
  hashChangeController().removeListener(this.hashchangeListener)
}

Hash.prototype.url = function () {
  var path = window.location.hash || '#'

  var m = /^#(.*?)(\?.*)?$/.exec(path)
  var pathname = m[1]
  var search = m[2]

  return '/' + pathname + (search || '')
}

Hash.prototype.waitForHashChangeEvents = function () {
  return hashChangeController().waitForHashChangeEvents()
}

Hash.prototype.push = function (url) {
  hashChangeController().push(url)
}

Hash.prototype.state = function () {
}

Hash.prototype.replace = function (url) {
  return this.push(url)
}

var _hashChangeController

function hashChangeController () {
  if (!_hashChangeController) {
    _hashChangeController = new HashChangeController()
  }

  return _hashChangeController
}

function HashChangeController () {
  var self = this

  this.listeners = []
  this.pushed = 0
  this.hashchange = function (event) {
    if (!self.pushed > 0) {
      for (var i = 0, l = self.listeners.length; i < l; i++) {
        self.listeners[i]()
      }
    } else {
      self.pushed--

      if (self.pushed === 0 && self._finished) {
        self._finished()
      }
    }
  }

  window.addEventListener('hashchange', this.hashchange)
}

HashChangeController.prototype.removeListener = function (listener) {
  var index = this.listeners.indexOf(listener)

  if (index >= 0) {
    this.listeners.splice(index, 1)
  }
}

HashChangeController.prototype.addListener = function (listener) {
  this.listeners.push(listener)
}

HashChangeController.prototype.push = function (url) {
  var oldUrl = window.location.href

  window.location.hash = url.replace(/^\//, '')

  if (window.location.href !== oldUrl) {
    this.pushed++
  }
}

HashChangeController.prototype.waitForHashChangeEvents = function () {
  var self = this
  return this.pushed === 0
    ? Promise.resolve()
    : new Promise(function (resolve) {
      self._finished = resolve
    })
}

function HrefAttribute (routeDefinition, params, options) {
  this.href = routeDefinition.url(params)
  this.onclick = refreshify(function (event) {
    if (!event.metaKey) {
      routeDefinition.push(params, options)
      event.preventDefault()
    }
  })
}

HrefAttribute.prototype.hook = function (element) {
  element.href = this.href
  element.onclick = this.onclick
}

HrefAttribute.prototype.unhook = function (element) {
  element.onclick = null
}

function MemoryRouter () {
  this.history = []
  this.historyIndex = 0
}

MemoryRouter.prototype.push = function (url) {
  this.history.splice(0, this.historyIndex)
  this.historyIndex = 0
  this.history.unshift(url)
}

MemoryRouter.prototype.replace = function (url) {
  this.history.splice(0, this.historyIndex)
  this.historyIndex = 0
  this.history[0] = url
}

MemoryRouter.prototype.start = function (model) {
  this.model = model
}

MemoryRouter.prototype.stop = function () {
}

MemoryRouter.prototype.back = function () {
  this.historyIndex++
  this.model.refresh()
}

MemoryRouter.prototype.forward = function () {
  this.historyIndex = Math.max(0, this.historyIndex - 1)
  this.model.refresh()
}

MemoryRouter.prototype.url = function () {
  return this.history[this.historyIndex]
}

exports = module.exports = new Router()

exports.hash = function () {
  return new Hash()
}

exports.pushState = function () {
  return new PushState()
}

exports.memory = function () {
  return new MemoryRouter()
}

exports.querystring = function () {
  return new QueryString()
}

exports.router = function (options) {
  return new Router(options)
}
