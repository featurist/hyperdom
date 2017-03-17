var hyperdomMeta = require('./meta');
var runRender = require('./render');
var Set = require('./set');
var refreshEventResult = require('./refreshEventResult')
var vtext = require("virtual-dom/vnode/vtext.js")
var PropertyHook = require('./propertyHook');

var lastId = 0;

function Mount(model, options) {
  var win = (options && options.window) || window;
  var router = typeof options == 'object' && options.hasOwnProperty('router')? options.router: undefined;
  this.requestRender = (options && options.requestRender) || win.requestAnimationFrame || win.setTimeout;

  this.model = model;

  this.renderQueued = false;
  this.mountRenderRequested = false;
  this.widgetRendersRequested = undefined;
  this.id = ++lastId;
  this.mounted = true;
  this.router = router
}

Mount.prototype.refreshify = function(fn, options) {
  if (!fn) {
    return fn;
  }

  if (options && (options.norefresh == true || options.refresh == false)) {
    return fn;
  }

  var self = this

  return function () {
    var result = fn.apply(this, arguments);
    return refreshEventResult(result, self, options);
  };
}

Mount.prototype.transformFunctionAttribute = function(key, value) {
  return this.refreshify(value)
};

Mount.prototype.queueRender = function () {
  if (!this.renderQueued) {
    var self = this;

    var requestRender = this.requestRender;
    this.renderQueued = true;

    requestRender(function () {
      self.renderQueued = false;

      if (self.mounted) {
        if (self.mountRenderRequested) {
          self.rerenderImmediately()
        } else if (self.widgetRendersRequested) {
          self.rerenderWidgetsImmediately()
        }
      }
    });
  }
};

Mount.prototype.render = function() {
  if (this.router) {
    this.setupModelComponent(this.model)
    return this.router.render(this.model)
  } else {
    return this.renderViewModel(this.model)
  }
};

Mount.prototype.rerender = function () {
  this.mountRenderRequested = true;
  this.queueRender();
};

Mount.prototype.rerenderImmediately = function() {
  var self = this

  runRender(self, function () {
    var vdom = self.render();
    self.component.update(vdom);
    self.mountRenderRequested = false;
  })
}

Mount.prototype.rerenderWidgetsImmediately = function() {
  var self = this

  runRender(self, function () {
    for (var i = 0, l = self.widgetRendersRequested.length; i < l; i++) {
      var w = self.widgetRendersRequested[i];
      w.rerender();
    }
    self.widgetRendersRequested = undefined;
  })
}

Mount.prototype.rerenderWidget = function (widget) {
  if (!this.widgetRendersRequested) {
    this.widgetRendersRequested = [];
  }

  this.widgetRendersRequested.push(widget);
  this.queueRender();
};

Mount.prototype.setupModelComponent = function(model) {
  var self = this;

  var meta = hyperdomMeta(model);

  if (!meta.mount) {
    meta.mount = this;
    meta.widgets = new Set();

    model.rerender = function () {
      self.rerender();
    };

    model.rerenderImmediately = function () {
      self.rerenderImmediately();
    };

    model.rerenderViewModel = function() {
      var meta = hyperdomMeta(this);
      meta.widgets.forEach(function (w) {
        self.rerenderWidget(w);
      });
    };

    if (typeof model.onload == 'function') {
      this.refreshify(function () { return model.onload(); }, {refresh: 'promise'})();
    }
  }
}

Mount.prototype._renderViewModel = function(model) {
  this.setupModelComponent(model)
  var vdom = typeof model.render == 'function'? model.render(): new vtext(JSON.stringify(model))

  if (vdom instanceof Array) {
    throw new Error('vdom returned from component cannot be an array');
  }

  if (vdom) {
    if (!vdom.properties) {
      vdom.properties = {};
    }

    vdom.properties._hyperdomMeta = new PropertyHook({
      viewModel: model,
      render: runRender.currentRender()
    });
  }

  return vdom;
}

Mount.prototype.renderViewModel = function(model) {
  if (typeof model.renderCacheKey === 'function') {
    var meta = hyperdomMeta(model);
    var key = model.renderCacheKey();
    if (key !== undefined && meta.cacheKey === key && meta.cachedVdom) {
      return meta.cachedVdom;
    } else {
      meta.cacheKey = key;
      return meta.cachedVdom = this._renderViewModel(model);
    }
  } else {
    return this._renderViewModel(model);
  }
};

Mount.prototype.detach = function () {
  this.mounted = false;
};

Mount.prototype.remove = function () {
  this.component.destroy({removeElement: true});
  this.mounted = false;
};

module.exports = Mount;
