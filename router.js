var plastiq = require('.');
var rendering = require('./rendering');
var createBinding = require('./binding');
var routism = require('routism');

var state;

function page() {
  if (arguments.length == 3) {
    var url = arguments[0];
    var options = arguments[1];
    var render = arguments[2];
    var binding = createBinding(options.binding);

    return {
      url: url,
      render: function (params, isNewLocation) {
        if (isNewLocation) {
          if (rendering.currentRender.lastBinding) {
            rendering.currentRender.lastBinding.set();
          }
          rendering.currentRender.lastBinding = binding;

          if (state) {
            rendering.currentRender.routeState = state;
          } else {
            rendering.currentRender.routeState = options.state(params);
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
    return plastiq.html.window(
      {
        onpopstate: function (ev) {
          state = ev.state;
        }
      },
      route.route.render(makeHash(route.params), hrefChanged())
    );
  } else {
    return plastiq.html('div', '404');
  }
};

function push(url) {
  if (typeof url === 'string') {
    state = undefined;
    window.history.pushState(undefined, undefined, url);
  } else {
    var ev = url;
    var href = ev.target.href;
    push(href);
    ev.preventDefault();
  }
}

function replace(url) {
  if (typeof url === 'string') {
    state = undefined;
    window.history.replaceState(undefined, undefined, url);
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
