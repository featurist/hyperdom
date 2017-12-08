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

function walkRoutes (location, model, visit, options) {
  function walk (model, parentModels) {
    if (model) {
      if (typeof model.routes === 'function') {
        runRender.currentRender().mount.setupModelComponent(model)

        return walk(model.routes(location), [model].concat(parentModels))
      } else if (model instanceof Array) {
        var routes = model
        for (var r = 0, l = routes.length; r < l; r++) {
          var route = routes[r]

          var vdom = walk(route, parentModels)

          if (vdom) {
            return vdom
          }
        }

        return
      } else if (typeof model.renderRoute === 'function' || model.notFound) {
        return visit(model, parentModels)
      } else if (typeof model === 'function') {
        return visit({
          renderRoute: model
        }, parentModels)
      }
    }

    throw new Error('expected a route to be a function, an array, or a model. see https://github.com/featurist/hyperdom#routing')
  }

  return walk(model, options.parentModels || [])
}

function findRoutes (location, model, options) {
  var routes = []
  var notFound

  walkRoutes(location, model, function (route, models) {
    if (route.notFound) {
      notFound = route
    } else {
      routes.push({
        route: route,
        models: models
      })
    }
  }, options)

  return {
    routes: routes,
    notFound: notFound
  }
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

Router.prototype.redirect = function (redirectUrl) {
  this.replace(redirectUrl)
  throw this._redirectError
}

function Location (router, url) {
  this.url = url
  this.lastUrl = router.lastUrl
  this.isNewUrl = url !== this.lastUrl
  this.router = router
}

Location.prototype.redirect = function (redirectUrl) {
  return this.router.redirect(redirectUrl)
}

Location.prototype.push = function (url) {
  this.url = url
  this.router.push(url)
}

Location.prototype.replace = function (url) {
  this.url = url
  this.router.replace(url)
}

function renderRoutes (location, model, next, options) {
  var routes = findRoutes(location, model, options)

  var vdom = routes.routes.reduceRight(function (next, routeModels) {
    return function (routes) {
      if (routeModels.executed) {
        return
      }
      routeModels.executed = true
      location.lastParentModels = routeModels.models
      return routeModels.route.renderRoute(location, function (routes) {
        if (routes) {
          return renderRoutes(location, routes, next, {parentModels: location.lastParentModels}) || next()
        } else {
          return next()
        }
      })
    }
  }, next || function () {})()

  if (!vdom && options && options.notFound) {
    var notFound = routes.notFound
      ? routes.notFound.render
      : renderNotFound

    return notFound(location.url, routes.routes.map(function (r) {
      return r.route
    }))
  } else {
    return vdom
  }
}

Router.prototype.render = function (model) {
  var self = this
  this.history.start(model)

  function renderUrl (redirects) {
    var url = self.url()
    var location = new Location(self, url)

    try {
      var vdom = renderRoutes(location, model, undefined, {notFound: true})
      self.lastUrl = location.url
      return location.lastParentModels ? layoutVdom(vdom, location.lastParentModels) : vdom
    } catch (e) {
      if (e === self._redirectError) {
        if (redirects.length > 10) {
          throw new Error('hyperdom: too many redirects:\n  ' + redirects.join('\n  '))
        }
        redirects.push(url)
        return renderUrl(redirects)
      } else {
        throw e
      }
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

function renderNotFound (url, routes) {
  var routeDescriptions = routes.map(function (r) {
    return '  ' + r
  }).join('\n')
  return h('pre', h('code', 'no route for: ' + url + '\n\navailable routes:\n\n' + routeDescriptions))
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
  if (arguments.length === 1 && typeof options === 'object') {
    return new Route(options, this)
  }

  var args = Array.prototype.slice.call(arguments)
  var lastArgIndex = args.length - 1
  var lastArg = args[lastArgIndex]
  if (lastArg && typeof lastArg === 'object') {
    args[lastArgIndex] = new Route(lastArg, this)
  }

  return new MiddlewareRoute(args, this)
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

RouteDefinition.prototype.matchBaseUrl = function (url) {
  return this.baseRegex.exec(url.split('?')[0])
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

function MiddlewareRoute (routes, definition) {
  this._routes = routes
  this.definition = definition
}

MiddlewareRoute.prototype.renderRoute = function (location, next) {
  if (this.definition) {
    if (!this.definition.matchUrl(location.url)) {
      return next()
    }
  }

  return next(this._routes)
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

Router.prototype.hasRoute = function (model, url) {
  var action = walkRoutes(url, model, function (route, match) {
    if (!route.notFound && (match = route.matchUrl(url))) {
      return {}
    }
  })

  return !!action
}

Router.prototype.use = function () {
  return new MiddlewareRoute(Array.prototype.slice.call(arguments))
}

Route.prototype.renderRoute = function (location, next) {
  var match
  if ((match = this.matchUrl(location.url))) {
    return location.isNewUrl
      ? this.set(location, next, match)
      : this.get(location, next, match)
  } else if (next) {
    return next()
  }
}

Route.prototype.matchUrl = function (url) {
  return this.definition.matchUrl(url)
}

Route.prototype.set = function (location, next, match) {
  var self = this
  var params = this.definition.params(location.url, match)

  location.params = params

  if (this.model.redirect) {
    var redirectUrl = this.model.redirect(params)
    if (redirectUrl) {
      return location.redirect(redirectUrl)
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

  return this.render(location, next)
}

Route.prototype.get = function (location, next) {
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

  if (newUrl) {
    if (push) {
      location.push(newUrl)
    } else {
      location.replace(newUrl)
    }
  }

  return this.render(location, next)
}

Route.prototype.render = function (location, next) {
  if (typeof this.model.routes === 'function') {
    return next(this.model.routes(location))
  } else {
    return this.model.render(location, next)
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
    if (model) {
      model.refreshImmediately()

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
    }
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
}

Hash.prototype.start = function (model) {
  var self = this
  if (this.started) {
    return
  }
  this.started = true

  this.hashchangeListener = function () {
    if (self.started) {
      if (!self.pushed) {
        if (model) {
          model.refreshImmediately()
        }
      } else {
        self.pushed = false
      }
    }
  }
  window.addEventListener('hashchange', this.hashchangeListener)
}

Hash.prototype.stop = function () {
  this.started = false
  window.removeEventListener('hashchange', this.hashchangeListener)
}

Hash.prototype.url = function () {
  var path = window.location.hash || '#'

  var m = /^#(.*?)(\?.*)?$/.exec(path)
  var pathname = m[1]
  var search = m[2]

  return '/' + pathname + (search || '')
}

Hash.prototype.push = function (url) {
  this.pushed = true
  window.location.hash = url.replace(/^\//, '')
}

Hash.prototype.state = function () {
}

Hash.prototype.replace = function (url) {
  return this.push(url)
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

exports = module.exports = new Router()

exports.hash = function () {
  return new Hash()
}

exports.pushState = function () {
  return new PushState()
}

exports.querystring = function () {
  return new QueryString()
}

exports.router = function (options) {
  return new Router(options)
}
