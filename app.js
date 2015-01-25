var routism = require('routism');
var rendering = require('./rendering');

module.exports = function () {
  return new App;
}

function App() {
  this.routes = [];
}

App.prototype.get = function(path, handler) {
  this.routes.push({ pattern: path, route: handler });
}

App.prototype.attach = function (element, model, path) {
  var app = this;
  
  function render(model) {
    return model.route ?
      model.route.route(model.route.params, model)
      : rendering.html.animation(navigationAnimation);
  }
  
  function navigationAnimation(refresh) {
    app.refresh = refresh;
  }
  
  app.model = model;
  app.router = routism.compile(this.routes);
  rendering.attach(element, render, model);
  
  this.navigateTo(path || '/');
}

App.prototype.navigateTo = function (path) {
  var routeForPath = this.router.recognise(path);
  if (routeForPath) {
    this.model.route = routeForPath;
    this.model.route.params = paramsArrayToObject(routeForPath.params);
    this.refresh();
  }
  else {
    throw new Error("No route for " + path);
  }
}

function paramsArrayToObject(array) {
  var p = {};
  for (var i = 0; i < array.length; ++i) {
    p[array[i][0]] = array[i][1];
  }
  return p;
}
