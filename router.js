var makeBinding = require('./binding')
var refreshify = require('./refreshify')
var runRender = require('./render')
var h = require('./rendering').html

function Router(options) {
  this._querystring = typeof options == 'object' && options.hasOwnProperty('querystring')? options.querystring: new QueryString();
  this.history = typeof options == 'object' && options.hasOwnProperty('history')? options.history: new PushState();
}

Router.prototype.reset = function() {
  this.lastUrl = undefined
  this.history.stop()
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
          if (action.push) {
            self.history.push(action.url)
          } else {
            self.history.replace(action.url)
          }
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

Router.prototype.push = function(url) {
  this.history.push(url)
};

Router.prototype.replace = function(url) {
  this.history.replace(url)
};

function renderNotFound(url, routes) {
  return h('pre', h('code', 'no route for: ' + url + '\n\navailable routes:\n\n' + routes.map(function (r) { return '  ' + r.pattern; }).join('\n')))
}

var notFoundPatternVariables = preparePattern('*')

Router.prototype.notFound = function(options) {
  options.notFound = true
  return new Route(notFoundPatternVariables, options, this)
}

Router.prototype.route = function(pattern) {
  var self = this
  var patternVariables = preparePattern(pattern)

  function route(options) {
    return new Route(patternVariables, options, self)
  }

  route.params = function() {
    return route().urlParams(self.url())
  }

  route.push = function(params, options) {
    self.history.push(self.expandUrl(patternVariables.pattern, params))
    if (!(options && options.resetScroll == false)) {
      window.scrollTo(0, 0)
    }
  }

  route.replace = function(params) {
    self.history.replace(self.expandUrl(patternVariables.pattern, params))
  }

  route.href = function(params, options) {
    return new HrefAttribute(route, params, options)
  }

  route.url = function(params) {
    return self.expandUrl(patternVariables.pattern, params)
  }

  return route
}

function Route(patternVariables, options, router) {
  this.pattern = patternVariables.pattern
  this.router = router

  this.variables = patternVariables.variables
  this.regex = patternVariables.regex
  this.mountRegex = patternVariables.mountRegex

  this.routes = typeof options == 'object' && options.hasOwnProperty('routes')? options.routes: undefined;
  var bindings = typeof options == 'object' && options.hasOwnProperty('bindings')? options.bindings: undefined
  this.bindings = bindings? bindParams(bindings): undefined
  this.onload = typeof options == 'object' && options.hasOwnProperty('onload')? options.onload: undefined
  this.render = typeof options == 'object' && options.hasOwnProperty('render')? options.render: (this.routes? function(inner) { return inner }: function () {})
  this.redirect = typeof options == 'object' && options.hasOwnProperty('redirect')? options.redirect: undefined

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
    bindings[key] = makeBinding(params[key], {refresh: 'promise'})
  })

  return bindings
}

Route.prototype.hasRoute = function(model, url) {
  var routes = modelRoutes(model, true)
  var match = findMatch(url, routes)
  return !!match && !match.route.notFound
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
  var params = this.router._querystring.parse(query)

  if (match) {
    for (var n = 1; n < match.length - 1; n++) {
      params[this.variables[n - 1]] = match[n]
    }
  }

  return params
}

Route.prototype.set = function(url, match) {
  var self = this
  var params = this.urlParams(url, match)

  if (this.redirect) {
    var redirectUrl = this.redirect(params)
    if (redirectUrl) {
      return {
        redirect: redirectUrl
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
    refreshify(function () {
      return self.onload(params)
    }, {refresh: 'promise'})()
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

Route.prototype.wrapAction = function(action) {
  var innerRender = action.render
  var outerRender = this.render
  action.render = function() {
    return outerRender(innerRender())
  }
  return action
}

Route.prototype.get = function(url) {
  var self = this
  var routes
  
  if (this.bindings) {
    var params = {}
    Object.keys(this.bindings).forEach(function (key) {
      var binding = self.bindings[key]

      if (binding && binding.get) {
        params[key] = binding.get()
      }
    })

    var oldParams = this.urlParams(url)
    var newUrl = this.router.expandUrl(this.pattern, extend(extend({}, oldParams), params))
    var newParams = this.urlParams(newUrl)
    var push = this.push(oldParams, newParams)
  }

  if (this.routes) {
    routes = modelRoutes(this)
    return this.wrapAction(getUrl(url, routes))
  } else {
    return {
      url: newUrl,
      push: push,
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

Router.prototype.expandUrl = function(pattern, _params) {
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

  var query = this._querystring.stringify(onlyQueryParams)

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
    regex: new RegExp('^' + compiledPattern + '($)'),
    mountRegex: new RegExp('^' + compiledPattern + (pattern[pattern.length - 1] == '/'? '': '(/|$)')),
    variables: variables
  }
}

function setUrl(url, routes) {
  var match = findMatch(url, routes)
  if (match) {
    return match.route.set(url, match.match)
  }
}

function findMatch(url, routes) {
  for (var r = 0, l = routes.length; r < l; r++) {
    var route = routes[r];
    var match

    if ((match = route.match(url))) {
      return {
        route: route,
        match: match
      }
    }
  }
}

function getUrl(url, routes) {
  var match = findMatch(url, routes)
  if (match) {
    return match.route.get(url, match.match)
  }
}

function QueryString() {
}

QueryString.prototype.parse = function(search) {
  var params = {};

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

    if (param != '') {
      return encodeURIComponent(key) + '=' + encodeURIComponent(param)
    }
  }).filter(function (param) {
    return param
  }).join('&')

  return query
}

var PushState = function() {
}

PushState.prototype.start = function (model) {
  if (this.started) {
    return
  }
  this.started = true

  window.addEventListener('popstate', this.listener = function() {
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
      document.body.clientHeight
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
  var self = this;
  if (this.started) {
    return
  }
  this.started = true

  this.hashchangeListener = function() {
    if (self.started) {
      if (!self.pushed) {
        if (model) {
          model.refreshImmediately()
        }
      } else {
        self.pushed = false;
      }
    }
  }
  window.addEventListener('hashchange', this.hashchangeListener);
}

Hash.prototype.stop = function () {
  this.started = false
  window.removeEventListener('hashchange', this.hashchangeListener);
}

Hash.prototype.url = function() {
  var path = window.location.hash || '#';

  var m = /^#(.*?)(\?.*)?$/.exec(path);
  var pathname = m[1]
  var search = m[2]

  return '/' + pathname + (search? search: '')
};

Hash.prototype.push = function(url) {
  this.pushed = true;
  window.location.hash = url.replace(/^\//, '');
};

Hash.prototype.state = function() {
};

Hash.prototype.replace = function(url) {
  return this.push(url);
};

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
