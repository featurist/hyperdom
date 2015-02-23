var plastiq = require('./');
var rendering = require('./rendering');
var routism = require('routism');

function Router(options) {
  this.history = (options && options.history) ||
    (typeof window != 'undefined'
      ? exports.historyApi()
      : undefined);
}

Router.prototype.page = function() {
  var self = this;

  if (arguments.length == 3) {
    var url = arguments[0];
    var options = arguments[1];
    var render = arguments[2];
    var binding = plastiq.binding(options.binding, { norefresh: true });

    return {
      url: url,
      newUrl: function () {
        if (options.url) {
          var newUrl = options.url(binding.get());
          if (newUrl != self.history.location().pathname + self.history.location().search) {
            return newUrl;
          }
        }
      },
      render: function (params, isNewLocation) {
        if (isNewLocation) {
          if (rendering.currentRender.lastBinding) {
            rendering.currentRender.lastBinding.set();
          }
          rendering.currentRender.lastBinding = binding;

          var state = self.history.state.get();

          rendering.currentRender.routeState = state
            ? state
            : typeof options.state === 'function'
              ? options.state(params)
              : options.state;
        }

        return plastiq.html.promise(rendering.currentRender.routeState, {
          fulfilled: function (model) {
            if (rendering.currentRender.routeState) {
              binding.set(model);
              rendering.currentRender.routeState = undefined;
            }
            self.history.state.set(binding.get());
            return render();
          }
        });
      }
    };
  } else if (arguments.length == 2) {
    var url = arguments[0];
    var render = arguments[1];

    return {
      url: url,
      newUrl: function () {},
      render: function (params, isNewLocation) {
        if (isNewLocation) {
          if (rendering.currentRender.lastBinding) {
            rendering.currentRender.lastBinding.set();
          }
          rendering.currentRender.lastBinding = undefined;
        }
        return render(params);
      }
    };
  }
};

function makeHash(paramArray) {
  var params = {};

  paramArray.forEach(function (param) {
    params[param[0]] = param[1];
  });

  return params;
}

exports.historyApi = function () {
  var state;

  window.addEventListener('popstate', function (ev) {
    state = ev.state;
    h.refresh();
  });

  var h = {
    location: function () {
      return window.location;
    },
    state: {
      get: function () {
        return state;
      },
      set: function (state) {
        window.history.replaceState(state, undefined, window.location.href);
      }
    },
    clearState: function () {
      state = undefined;
    },
    push: function(url) {
      window.history.pushState(undefined, undefined, url);
    },
    replace: function(url) {
      window.history.replaceState(undefined, undefined, url);
    },
    refresh: function () {}
  };

  return h;
};

Router.prototype.hrefChanged = function() {
  var currentRender = rendering.currentRender || this;
  var changed = this.history.location().href != currentRender.lastHref;
  currentRender.lastHref = this.history.location().href;
  return changed;
};

Router.prototype.router = function() {
  this.history.refresh = plastiq.html.refresh;

  var newLocation = this.hrefChanged();

  var routes = [];

  for (var n = 0; n < arguments.length; n++) {
    var page = arguments[n];
    routes.push({pattern: page.url, route: page});
  }

  var compiledRoutes = routism.compile(routes);
  var route = compiledRoutes.recognise(this.history.location().pathname);

  if (route) {
    var newUrl = route.route.newUrl();

    if (newUrl && !newLocation) {
      this.replace(newUrl);
      return router.apply(this, arguments);
    } else {
      return route.route.render(makeHash(route.params), newLocation)
    }
  } else {
    return plastiq.html('div', '404');
  }
};

Router.prototype.push = function (url) {
  return this.replacePushState('push', url);
};

Router.prototype.replace = function (url) {
  return this.replacePushState('replace', url);
};

Router.prototype.replacePushState = function (replacePush, url) {
  if (typeof url === 'string') {
    this.history[replacePush](url);
    this.history.clearState();

    if (rendering.currentRender) {
      plastiq.html.refresh();
    }
  } else {
    var ev = url;
    var href = ev.target.href;
    this.push(href);
    ev.preventDefault();
  }
};

function router(options) {
  var routerObject = new Router(options);
  var r = routerObject.router.bind(routerObject);

  ['page', 'push', 'replace'].forEach(function (m) {
    r[m] = routerObject[m].bind(routerObject);
  });

  return r;
}

module.exports = router();

module.exports.with = function(options) {
  return router(options);
}
