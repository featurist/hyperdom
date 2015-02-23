var plastiq = require('./');
var rendering = require('./rendering');
var routism = require('routism');

var state;

function page() {
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
          if (newUrl != exports.history.location().pathname + exports.history.location().search) {
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

          var state = exports.history.state.get();

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
            exports.history.state.set(binding.get());
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

exports.historyApi = (function () {
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
})();

exports.history = exports.historyApi;

function hrefChanged() {
  var changed = exports.history.location().href != rendering.currentRender.lastHref;
  rendering.currentRender.lastHref = exports.history.location().href;
  return changed;
}

function router() {
  exports.history.refresh = plastiq.html.refresh;

  var newLocation = hrefChanged();

  var routes = [];

  for (var n = 0; n < arguments.length; n++) {
    var page = arguments[n];
    routes.push({pattern: page.url, route: page});
  }

  var compiledRoutes = routism.compile(routes);
  var route = compiledRoutes.recognise(exports.history.location().pathname);

  if (route) {
    var newUrl = route.route.newUrl();

    if (newUrl && !newLocation) {
      replace(newUrl);
      return router.apply(this, arguments);
    } else {
      return route.route.render(makeHash(route.params), newLocation)
    }
  } else {
    return plastiq.html('div', '404');
  }
};

function push(url) {
  return replacePushState('push', url);
}

function replace(url) {
  return replacePushState('replace', url);
}

function replacePushState(replacePush, url) {
  if (typeof url === 'string') {
    exports.history[replacePush](url);
    exports.history.clearState();

    if (rendering.currentRender) {
      plastiq.html.refresh();
    }
  } else {
    var ev = url;
    var href = ev.target.href;
    push(href);
    ev.preventDefault();
  }
}

module.exports = router;
module.exports.page = page;
module.exports.push = push;
module.exports.replace = replace;
