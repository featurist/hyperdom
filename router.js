var binding = require('./binding')
var refreshify = require('./refreshify')

var router

function defaultRouter() {
  return router? router: exports.set()
}

exports.render = function(model) {
  return defaultRouter().render(model)
}

exports.route = function(pattern) {
  return defaultRouter().route(pattern)
}

exports.set = function(options) {
  return router = new Router(options)
}

exports.create = function(options) {
  return new Router(options)
}

function Router(options) {
  var history = typeof options == 'object' && options.hasOwnProperty('history')? options.history: exports.historyApi;
  this.history = history
}

function modelRoutes(model) {
  if (typeof model.routes === 'function') {
    return model.routes()
  } else {
    throw new Error('for routing, hyperdom expects a model.routes() method to return route')
  }
}

Router.prototype.render = function(model) {
  this.history.start(model)

  var url = this.history.url()
  var routes = modelRoutes(model)

  var action
  if (this.lastUrl != url) {
    action = setUrl(url, routes)
  } else {
    action = getUrl(url, routes)
  }

  if (action) {
    if (action.url) {
      if (this.lastUrl != action.url) {
        if (action.push) {
          this.history.push(action.url)
        } else {
          this.history.replace(action.url)
        }

        this.lastUrl = this.history.url()
      }
    } else {
      this.lastUrl = url
    }

    if (action.route) {
      return action.route.render()
    }
  }
}

Router.prototype.route = function(pattern) {
  var self = this
  var patternVariables = preparePattern(pattern, true)

  function route(options) {
    return new Route(route, patternVariables, options)
  }

  route.push = function(params) {
    self.history.push(expand(patternVariables.pattern, params))
  }

  route.replace = function(params) {
    self.history.replace(expand(patternVariables.pattern, params))
  }

  route.href = function(params) {
    return new HrefAttribute(route, params)
  }

  route.url = function(params) {
    return expand(patternVariables.pattern, params)
  }

  return route
}

exports.hasRoute = function(model, url) {
  var routes = modelRoutes(model)
  return !!routes.find(function (r) { return r.match(url) })
}

function Route(route, patternVariables, options) {
  this.route = route
  this.pattern = patternVariables.pattern

  this.variables = patternVariables.variables
  this.regex = patternVariables.regex

  var params = typeof options == 'object' && options.hasOwnProperty('params')? options.params: {}
  this.params = bindParams(params)
  var binding = typeof options == 'object' && options.hasOwnProperty('binding')? options.binding: undefined
  this.binding = binding? binding(binding): undefined
  this.onload = typeof options == 'object' && options.hasOwnProperty('onload')? options.onload: undefined
  this.render = typeof options == 'object' && options.hasOwnProperty('render')? options.render: function () {}
  var push = typeof options == 'object' && options.hasOwnProperty('push')? options.push: undefined

  if (typeof push === 'function') {
    this.push = push
  } else if (push instanceof Object) {
    this.push = function (oldParams, newParams) {
      return Object.keys(push).some(function (key) {
        return push[key] && (oldParams.hasOwnProperty(key) || newParams.hasOwnProperty(key)) && oldParams[key] !== newParams[key]
      })
    }
  } else {
    this.push = function () { return push }
  }
}

function bindParams(params) {
  var bindings = {}

  Object.keys(params).forEach(function (key) {
    bindings[key] = binding(params[key])
  })

  return bindings
}

Route.prototype.match = function(url) {
  return this.regex.exec(url.split('?')[0])
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

  Object.keys(this.params).forEach(function (key) {
    var binding = self.params[key]

    if (binding && binding.set) {
      binding.set(params[key])
    }
  })

  if (this.binding && this.binding.set) {
    this.binding.set(params)
  }

  if (this.onload) {
    this.onload(params)
  }
}

Route.prototype.get = function(url) {
  var self = this
  var params = this.binding && this.binding.get? this.binding.get() || {}: {}

  Object.keys(this.params).forEach(function (key) {
    var binding = self.params[key]

    if (binding && binding.get) {
      params[key] = binding.get()
    }
  })

  var newUrl = expand(this.pattern, params)

  return {
    url: newUrl,
    push: this.push(this.urlParams(url), this.urlParams(newUrl)),
    route: this
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

var splatVariableRegex = /(\:([a-z\-_]+)\\\*)/ig
var variableRegex = /(:([-a-z_]+))/ig

function compilePattern(pattern) {
  return escapeRegex(pattern)
    .replace(splatVariableRegex, "(.+)")
    .replace(variableRegex, "([^\/]+)")
}

function preparePattern(pattern, full) {
  var match
  var variableRegex = new RegExp('(:([-a-z_]+))', 'ig')
  var variables = []

  while ((match = variableRegex.exec(pattern))) {
    variables.push(match[2])
  }

  var patternRegex = new RegExp('^' + compilePattern(pattern) + (full? '$': ''))

  return {
    pattern: pattern,
    regex: patternRegex,
    variables: variables
  }
}

function setUrl(url, routes) {
  var match
  var route = routes.find(function (r) { return match = r.match(url) })
  if (route) {
    route.set(url, match)
    return {
      route: route
    }
  }
}

function getUrl(url, routes) {
  var route = routes.find(function (r) { return r.match(url) })
  if (route) {
    return route.get(url)
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

exports.historyApi = {
  start: function (model) {
    var self = this
    if (this.started) {
      return
    }
    this.started = true
    this.active = true

    window.addEventListener('popstate', function(ev) {
      if (self.active) {
        self.popstate = true
        self.popstateState = ev.state
        if (model) {
          model.rerender()
        }
      }
    })
  },
  stop: function () {
    // I _think_ this is a chrome bug
    // if we removeEventListener then history.back() doesn't work
    // Chrome Version 43.0.2357.81 (64-bit), Mac OS X 10.10.3
    // yeah...
    this.active = false
  },
  url: function () {
    return window.location.pathname + window.location.search
  },
  push: function (url) {
    window.history.pushState(undefined, undefined, url)
  },
  state: function (state) {
    window.history.replaceState(state)
  },
  replace: function (url) {
    window.history.replaceState(undefined, undefined, url)
  }
}

function HrefAttribute(route, params) {
  this.href = route.url(params)
  this.onclick = refreshify(function() {
    route.push(params)
    return false
  })
}

HrefAttribute.prototype.hook = function (element) {
  element.href = this.href
  element.onclick = this.onclick
}

HrefAttribute.prototype.unhook = function (element) {
  element.onclick = null
}
