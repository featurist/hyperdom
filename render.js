var simplePromise = require('./simplePromise');

function runRender(mount, fn) {
  var render = new Render(mount);

  try {
    runRender._currentRender = render;

    return fn();
  } finally {
    render.finished.fulfill();
    runRender._currentRender = undefined;
  }
}

function Render(mount) {
  this.finished = simplePromise();
  this.mount = mount;
  this.attachment = mount;
}

Render.prototype.transformFunctionAttribute = function() {
  return this.mount.transformFunctionAttribute.apply(this.mount, arguments)
}

module.exports = runRender

runRender.currentRender = function () {
  return runRender._currentRender || defaultRender;
};

var defaultRender = {
  mount: {
    rerenderViewModel: function() {},
    renderViewModel: function(model) { return model.render() },
    rerender: function() {},
    render: function() {}
  },

  transformFunctionAttribute: function (key, value) {
    return value
  }
}
