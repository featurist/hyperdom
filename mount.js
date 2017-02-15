var hyperdomMeta = require('./meta');
var render = require('./render');
var Set = require('./set');
var refreshify = require('./refreshify')
var refreshEventResult = require('./refreshEventResult')

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
    var requestRender = this.requestRender;
    var self = this;

    requestRender(function () {
      self.renderQueued = false;

      if (self.mounted) {
        render(self, function () {
          if (self.mountRenderRequested) {
            var vdom = self.render();
            self.component.update(vdom);
            self.mountRenderRequested = false;
          } else if (self.widgetRendersRequested && self.widgetRendersRequested.length) {
            for (var i = 0, l = self.widgetRendersRequested.length; i < l; i++) {
              var w = self.widgetRendersRequested[i];
              w.rerender();
            }
            self.widgetRendersRequested = undefined;
          }
        });
      }
    });

    this.renderQueued = true;
  }
};

Mount.prototype.render = function() {
  if (this.router) {
    this.setupViewModel(this.model)
    return this.router.render(this.model)
  } else {
    return this.renderViewModel(this.model);
  }
};

Mount.prototype.rerender = function () {
  this.mountRenderRequested = true;
  this.queueRender();
};

Mount.prototype.rerenderWidget = function (widget) {
  if (!this.widgetRendersRequested) {
    this.widgetRendersRequested = [];
  }

  this.widgetRendersRequested.push(widget);
  this.queueRender();
};

Mount.prototype.setupViewModel = function(model) {
  var self = this;

  model.rerender = function () {
    self.rerender();
  };
  model.rerenderViewModel = function() {
    var meta = hyperdomMeta(this);
    meta.widgets.forEach(function (w) {
      self.rerenderWidget(w);
    });
  };

  var meta = hyperdomMeta(model);
  if (!meta.mount) {
    meta.mount = this;
  }

  if (!meta.widgets) {
    meta.widgets = new Set();
  }

  if (typeof model.onload == 'function') {
    if (!meta.loaded) {
      meta.loaded = true;
      refreshify(function () { return model.onload(); }, {refresh: 'promise'})();
    }
  }
}

Mount.prototype._renderViewModel = function(model) {
  this.setupViewModel(model)
  var vdom = model.render();

  if (vdom instanceof Array) {
    throw new Error('vdom returned from component cannot be an array');
  }

  if (vdom && vdom.properties) {
    vdom.properties._hyperdomViewModel = model;
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
