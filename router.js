var makeBinding = require('./binding')
var refreshify = require('./refreshify')
var h = require('./rendering').html

var router

function defaultRouter() {
  return router? router: exports.set()
}

exports.render = function() {
  var router = defaultRouter()
  return router.render.apply(router, arguments)
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
  var history = typeof options == 'object' && options.hasOwnProperty('history')? options.history: exports.historyApi;
  this.history = history
}

function modelRoutes(model) {
  if (typeof model.routes === 'function') {
    return model.routes()
  } else {
    return []
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

    if (action.render) {
      return action.render()
    }
  } else {
    return renderNotFound(url)
  }
}

function renderNotFound(url) {
  return h('code', 'no route for ' + url)
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
  var route = routes.find(function (r) { return r.match(url) })

  return !!route && !route.notFound
}

function Route(patternVariables, options) {
  this.pattern = patternVariables.pattern

  this.variables = patternVariables.variables
  this.regex = patternVariables.regex
  this.mountRegex = patternVariables.mountRegex

  this.mount = typeof options == 'object' && options.hasOwnProperty('mount')? options.mount: undefined;
  var params = typeof options == 'object' && options.hasOwnProperty('params')? options.params: undefined
  this.params = params? bindParams(params): undefined
  var binding = typeof options == 'object' && options.hasOwnProperty('binding')? options.binding: undefined
  this.binding = binding? makeBinding(binding): undefined
  this.onload = typeof options == 'object' && options.hasOwnProperty('onload')? options.onload: undefined
  this.render = typeof options == 'object' && options.hasOwnProperty('render')? options.render: (this.mount? undefined: function () {})
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
    bindings[key] = makeBinding(params[key])
  })

  return bindings
}

Route.prototype.match = function(url) {
  if (this.mount) {
    var match = this.mountRegex.exec(url.split('?')[0])

    if (match) {
      var subRoutes = modelRoutes(this.mount)
      var subMatch
      var subRoute = subRoutes.find(function (r) { return subMatch = r.match(url) })

      if (subMatch) {
        return {
          baseMatch: match,
          subRoute: subRoute,
          subMatch: subMatch
        }
      }
    }
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
  var mountMatch
  if (this.mount) {
    mountMatch = match
    match = mountMatch.baseMatch
  }

  var defaultParams = { url: url }

  var self = this
  var params = extend(this.urlParams(url, match), defaultParams)

  if (this.params) {
    Object.keys(this.params).forEach(function (key) {
      var binding = self.params[key]

      if (binding && binding.set) {
        binding.set(params[key])
      }
    })
  }

  if (this.binding && this.binding.set) {
    this.binding.set(params)
  }

  if (this.onload) {
    refreshify(function () { return self.onload(params) }, {refresh: 'proimse'})()
  }

  if (this.mount) {
    var action = mountMatch.subRoute.set(url, mountMatch.subMatch)

    return {
      render: mountRender(this, action.render)
    }
  } else {
    return {
      render: this.render.bind(this)
    }
  }
}

function mountRender(baseRoute, render) {
  return function() {
    if (baseRoute.render) {
      return baseRoute.render(render())
    } else {
      return render()
    }
  }
}

Route.prototype.get = function(url, match, baseParams) {
  var self = this
  var action
  var defaultParams = { url: url }

  
  if (this.binding || baseParams || this.params) {
    var bindingParams = this.binding && this.binding.get? this.binding.get() || {}: {}

    var paramsParams = {}
    Object.keys(this.params).forEach(function (key) {
      var binding = self.params[key]

      if (binding && binding.get) {
        paramsParams[key] = binding.get()
      }
    })

    var params = extend(extend(baseParams || {}, paramsParams), bindingParams)
    var newUrl = expand(this.pattern, params)
    var oldParams = this.urlParams(url)
    var newParams = this.urlParams(newUrl)
    var push = this.push(oldParams, newParams)

    if (this.mount) {
      action = match.subRoute.get(url, undefined, params)

      return {
        url: action.url,
        push: push || action.push,
        render: mountRender(this, action.render)
      }
    } else {
      return {
        url: newUrl,
        push: push,
        render: this.render.bind(this)
      }
    }
  } else {
    if (this.mount) {
      action = match.subRoute.get(url)

      return {
        url: action.url,
        push: action.push,
        render: mountRender(this, action.render)
      }
    } else {
      return {
        render: this.render.bind(this)
      }
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
    mountRegex: new RegExp('^' + compiledPattern + (pattern.endsWith('/')? '': '(/|$)')),
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
  this.onclick = refreshify(function(event) {
    if (!event.metaKey) {
      route.push(params)
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
