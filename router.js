var makeBinding = require('./binding')
var refreshify = require('./refreshify')
var runRender = require('./render')
var h = require('./rendering').html

var router

function defaultRouter() {
  return router? router: exports.set()
}

exports.reset = function() {
  defaultRouter().reset()
}

exports.render = function() {
  var router = defaultRouter()
  return router.render.apply(router, arguments)
}

exports.url = function() {
  return defaultRouter().url()
}

exports.route = function() {
  var router = defaultRouter()
  return router.route.apply(router, arguments)
}

exports.notFound = function() {
  var router = defaultRouter()
  return router.notFound.apply(router, arguments)
}

exports.set = function(options) {
  return router = new Router(options)
}

exports.create = function(options) {
  return new Router(options)
}

function Router(options) {
  var history = typeof options == 'object' && options.hasOwnProperty('history')? options.history: new HistoryApi();
  this.history = history
}

Router.prototype.reset = function() {
  this.lastUrl = undefined
  this.history.reset()
}

function modelRoutes(model, isModel) {
  if (isModel) {
    runRender.currentRender().mount.setupModelComponent(model)
  }

  if (typeof model.routes === 'function') {
    var routes = model.routes()
    if (routes instanceof Object && typeof routes.routes === 'function') {
      return modelRoutes(routes, true)
    } else {
      return routes
    }
  } else {
    return []
  }
}

Router.prototype.url = function() {
  return this.history.url()
}

Router.prototype.render = function(model) {
  var self = this
  this.history.start(model)

  function renderUrl(redirects) {
    var url = self.history.url()
    var routes = modelRoutes(model, true)

    var action
    if (self.lastUrl != url) {
      action = setUrl(url, routes)
    } else {
      action = getUrl(url, routes)
    }

    if (action) {
      if (action.url) {
        if (self.lastUrl != action.url) {
          self.history.replace(action.url)
          self.lastUrl = self.history.url()
        }
      } else if (action.redirect) {
        if (redirects.length > 10) {
          throw new Error('hyperdom: too many redirects:\n  ' + redirects.join('\n  '))
        }
        self.history.replace(action.redirect)
        redirects.push(url)
        return renderUrl(redirects)
      } else {
        self.lastUrl = url
      }

      if (action.render) {
        return action.render()
      }
    } else {
      return renderNotFound(url, routes)
    }
  }

  return renderUrl([])
}

function renderNotFound(url, routes) {
  return h('pre', h('code', 'no route for: ' + url + '\n\navailable routes:\n\n' + routes.map(function (r) { return '  ' + r.pattern; }).join('\n')))
}

Router.prototype.notFound = (function() {
  var patternVariables = preparePattern('*')

  return function(options) {
    options.notFound = true
    return new Route(patternVariables, options)
  }
})()

Router.prototype.route = function(pattern) {
  var self = this
  var patternVariables = preparePattern(pattern)

  function route(options) {
    return new Route(patternVariables, options)
  }

  route.push = function(params, options) {
    self.history.push(expand(patternVariables.pattern, params))
    if (!(options && options.resetScroll == false)) {
      window.scrollTo(0, 0)
    }
  }

  route.replace = function(params) {
    self.history.replace(expand(patternVariables.pattern, params))
  }

  route.href = function(params, options) {
    return new HrefAttribute(route, params, options)
  }

  route.url = function(params) {
    return expand(patternVariables.pattern, params)
  }

  return route
}

exports.hasRoute = function(model, url) {
  var routes = modelRoutes(model, true)
  var route = routes.find(function (r) { return r.match(url) })

  return !!route && !route.notFound
}

function Route(patternVariables, options) {
  this.pattern = patternVariables.pattern

  this.variables = patternVariables.variables
  this.regex = patternVariables.regex
  this.mountRegex = patternVariables.mountRegex

  this.routes = typeof options == 'object' && options.hasOwnProperty('routes')? options.routes: undefined;
  var bindings = typeof options == 'object' && options.hasOwnProperty('bindings')? options.bindings: undefined
  this.bindings = bindings? bindParams(bindings): undefined
  this.onload = typeof options == 'object' && options.hasOwnProperty('onload')? options.onload: undefined
  this.render = typeof options == 'object' && options.hasOwnProperty('render')? options.render: (this.routes? function(inner) { return inner }: function () {})
  this.redirect = typeof options == 'object' && options.hasOwnProperty('redirect')? options.redirect: undefined
}

function bindParams(params) {
  var bindings = {}

  Object.keys(params).forEach(function (key) {
    bindings[key] = makeBinding(params[key])
  })

  return bindings
}

Route.prototype.match = function(url) {
  if (this.routes) {
    return this.mountRegex.exec(url.split('?')[0])
  } else {
    return this.regex.exec(url.split('?')[0])
  }
}

Route.prototype.urlParams = function(url, _match) {
  var query = url.split('?')[1]
  var match = _match || this.match(url)
  var params = exports.querystring.parse(query)

  if (match) {
    for (var n = 1; n < match.length; n++) {
      params[this.variables[n - 1]] = match[n]
    }
  }

  return params
}

Route.prototype.set = function(url, match) {
  var self = this
  var params = this.urlParams(url, match)

  if (this.redirect) {
    var url = this.redirect(params)
    if (url) {
      return {
        redirect: url
      }
    }
  }

  if (this.bindings) {
    Object.keys(this.bindings).forEach(function (key) {
      var binding = self.bindings[key]

      if (binding && binding.set) {
        binding.set(params[key])
      }
    })
  }

  if (this.onload) {
    refreshify(function () { return self.onload(params) }, {refresh: 'proimse'})()
  }

  if (this.routes) {
    var routes = modelRoutes(this)
    return this.wrapAction(setUrl(url, routes))
  } else {
    return {
      render: this.render.bind(this)
    }
  }
}

function subRender(outerRender, innerRender) {
  return function() {
    return outerRender(innerRender())
  }
}

Route.prototype.wrapAction = function(action) {
  var innerRender = action.render
  var outerRender = this.render
  action.render = function() {
    return outerRender(innerRender())
  }
  return action
}

Route.prototype.get = function(url, match, baseParams) {
  var self = this
  var action
  var routes
  
  if (this.bindings) {
    var params = {}
    Object.keys(this.bindings).forEach(function (key) {
      var binding = self.bindings[key]

      if (binding && binding.get) {
        params[key] = binding.get()
      }
    })

    var newUrl = expand(this.pattern, params)
    var oldParams = this.urlParams(url)
    var newParams = this.urlParams(newUrl)
  }

  if (this.routes) {
    routes = modelRoutes(this)
    return this.wrapAction(getUrl(url, routes))
  } else {
    return {
      url: newUrl,
      render: this.render.bind(this)
    }
  }
}

function extend(a, b) {
  if (b) {
    var keys = Object.keys(b)

    for (var k = 0, l = keys.length; k < l; k++) {
      var key = keys[k];
      a[key] = b[key]
    }

    return a
  }
}

function clone(thing) {
  return JSON.parse(JSON.stringify(thing))
}

function paramToString(p) {
  if (p === undefined || p === null) {
    return ''
  } else {
    return p
  }
}

function expand(pattern, _params) {
  var params = _params || {}
  var onlyQueryParams = clone(params)

  var url = pattern.replace(/:([a-z_][a-z0-9_]*)\*/gi, function (_, id) {
    var param = params[id]
    delete onlyQueryParams[id]
    return encodeURI(paramToString(param))
  })

  url = url.replace(/:([a-z_][a-z0-9_]*)/gi, function (_, id) {
    var param = params[id]
    delete onlyQueryParams[id]
    return encodeURIComponent(paramToString(param))
  })

  var query = exports.querystring.stringify(onlyQueryParams)

  if (query) {
    return url + '?' + query
  } else {
    return url
  }
}

function escapeRegex(pattern) {
  return pattern.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
}

function compilePattern(pattern) {
  var anyRegex = /\\\*/ig
  var splatVariableRegex = /:[a-z\-_]+\\\*/ig
  var variableRegex = /:[-a-z_]+/ig

  return escapeRegex(pattern)
    .replace(splatVariableRegex, "(.+)")
    .replace(anyRegex, ".*")
    .replace(variableRegex, "([^\/]+)")
}

function preparePattern(pattern) {
  var match
  var variableRegex = new RegExp(':([-a-z_]+)', 'ig')
  var variables = []

  while ((match = variableRegex.exec(pattern))) {
    variables.push(match[1])
  }

  var compiledPattern = compilePattern(pattern)

  return {
    pattern: pattern,
    regex: new RegExp('^' + compiledPattern + '$'),
    mountRegex: new RegExp('^' + compiledPattern + (pattern.endsWith('/')? '': '/|$')),
    variables: variables
  }
}

function setUrl(url, routes) {
  var match
  var route = routes.find(function (r) { return match = r.match(url) })
  if (route) {
    return route.set(url, match)
  }
}

function getUrl(url, routes) {
  var match
  var route = routes.find(function (r) { return match = r.match(url) })
  if (route) {
    return route.get(url, match)
  }
}

exports.querystring = {
  parse: function(search) {
    var params = {};

    if (search) {
      search.split('&').map(function (param) {
        var v = param.split('=').map(decodeURIComponent)
        params[v[0]] = v[1]
      })
    }

    return params
  },
  stringify: function(paramsObject) {
    var query = Object.keys(paramsObject).map(function (key) {
      var param = paramToString(paramsObject[key])

      if (param != '') {
        return encodeURIComponent(key) + '=' + encodeURIComponent(param)
      }
    }).filter(function (param) {
      return param
    }).join('&')

    return query
  }
}

var HistoryApi = function() {
}

HistoryApi.prototype.start = function (model) {
  if (this.started) {
    return
  }
  this.started = true

  window.addEventListener('popstate', this.listener = function() {
    if (model) {
      model.rerenderImmediately()

      // hack!
      // Chrome 56.0.2924.87 (64-bit)
      // explanation:
      // when you move back and forward in history the browser will remember the scroll
      // positions at each URL and then restore those scroll positions when you come
      // back to that URL, just like in normal navigation
      // However, the trick is to rerender the page so that it has the correct height
      // before that scroll takes place, which is what we do with model.rerenderImmediately()
      // also, it seems that its necessary to call document.body.clientHeight to force it
      // to layout the page before attempting set the scroll position
      document.body.clientHeight
    }
  })
}

HistoryApi.prototype.reset = function() {
  this.stop()
  this.started = false
  this.active = false
}

HistoryApi.prototype.stop = function () {
  window.removeEventListener('popstate', this.listener)
}

HistoryApi.prototype.url = function () {
  return window.location.pathname + window.location.search
}

HistoryApi.prototype.push = function (url) {
  window.history.pushState(undefined, undefined, url)
}

HistoryApi.prototype.state = function (state) {
  window.history.replaceState(state)
}

HistoryApi.prototype.replace = function (url) {
  window.history.replaceState(undefined, undefined, url)
}

function HrefAttribute(route, params, options) {
  this.href = route.url(params)
  this.onclick = refreshify(function(event) {
    if (!event.metaKey) {
      route.push(params, options)
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
