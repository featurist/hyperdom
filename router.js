var plastiq = require('.');
var rendering = require('./rendering');
var routism = require('routism');

var state;

function page() {
  if (arguments.length == 3) {
    var url = arguments[0];
    var options = arguments[1];
    var render = arguments[2];
    var binding = plastiq.binding(options.binding, { refreshOnSet: false });

    return {
      url: url,
      newUrl: function () {
        if (options.url) {
          var newUrl = options.url(binding.get());
          if (newUrl != location.pathname + location.search) {
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

          if (state) {
            rendering.currentRender.routeState = state;
          } else if (typeof state === 'function') {
            rendering.currentRender.routeState = options.state(params);
          } else {
            rendering.currentRender.routeState = options.state;
          }
        }

        return plastiq.html.promise(rendering.currentRender.routeState, {
          fulfilled: function (model) {
            if (rendering.currentRender.routeState) {
              binding.set(model);
              rendering.currentRender.routeState = undefined;
            }
            history.replaceState(binding.get(), undefined, location.href);
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

function hrefChanged() {
  var changed = location.href != rendering.currentRender.lastHref;
  rendering.currentRender.lastHref = location.href;
  return changed;
}

function router() {
  var routes = [];

  for (var n = 0; n < arguments.length; n++) {
    var page = arguments[n];
    routes.push({pattern: page.url, route: page});
  }

  var compiledRoutes = routism.compile(routes);
  var route = compiledRoutes.recognise(location.pathname);

  if (route) {
    var newUrl = route.route.newUrl();
    var changed = hrefChanged();

    if (newUrl && !changed) {
      replace(newUrl);
      return router.apply(this, arguments);
    } else {
      return plastiq.html.window(
        {
          onpopstate: function (ev) {
            state = ev.state;
          }
        },
        route.route.render(makeHash(route.params), changed)
      );
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
    state = undefined;
    window.history[replacePush + 'State'](undefined, undefined, url);

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
