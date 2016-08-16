var domComponent = require('./domComponent');
var rendering = require('./rendering');

function ViewModel(model) {
  this.model = model;
  this.key = model.key;
  this.component = domComponent();
  this.canRefresh = true;

  if (typeof this.model.onload == 'function') {
    var meta = this.model._plastiqMeta || (this.model._plastiqMeta = {});
    if (!meta.loaded) {
      meta.loaded = true;
      rendering.html.refreshify(function () { return model.onload(); }, {refresh: 'promise'})();
    }
  }

  var renderFinished = rendering.html.currentRender && rendering.html.currentRender.finished;
  if (renderFinished) {
    this.afterRender = function (fn) {
      renderFinished.then(fn);
    };
  } else {
    this.afterRender = function () {};
  }
}

ViewModel.prototype.type = 'Widget';

ViewModel.prototype.init = function () {
  var self = this;

  if (self.model.onbeforeadd) {
    self.model.onbeforeadd();
  }

  var vdom = this.render();
  if (vdom instanceof Array) {
    throw new Error('vdom returned from component cannot be an array');
  }

  var element = this.component.create(vdom);

  if (self.model.onadd) {
    this.afterRender(function () {
      self.model.onadd(element);
    });
  }

  if (self.model.detached) {
    return document.createTextNode('');
  } else {
    return element;
  }
};

ViewModel.prototype.update = function (previous) {
  var self = this;

  var refresh = !this.cacheKey || this.cacheKey !== previous.cacheKey;

  if (refresh) {
    if (self.model.onupdate) {
      this.afterRender(function () {
        self.model.onupdate(self.component.element);
      });
    }
  }

  this.component = previous.component;

  if (refresh) {
    var element = this.component.update(this.render());

    if (self.model.detached) {
      return document.createTextNode('');
    } else {
      return element;
    }
  }
};

ViewModel.prototype.render = function () {
  return this.model.render();
};

ViewModel.prototype.refresh = function () {
  this.component.update(this.render());
  if (this.state.onupdate) {
    this.state.onupdate(this.component.element);
  }
};

ViewModel.prototype.destroy = function (element) {
  var self = this;

  if (self.model.onremove) {
    this.afterRender(function () {
      self.model.onremove(element);
    });
  }

  this.component.destroy();
};

module.exports = ViewModel;
