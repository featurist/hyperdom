var domComponent = require('./domComponent');
var rendering = require('./rendering');
var plastiqMeta = require('./meta');
var Widgets = require('./widgets');
var renderViewModel = require('./renderViewModel');

function rerenderViewModel() {
  var meta = plastiqMeta(this);
  meta.widgets.forEach(function (w) {
    w.refresh();
  });
}

function ViewModel(model) {
  this.model = model;
  this.key = model.renderKey;
  this.component = domComponent();

  this.model.rerender = rendering.html.refresh;
  this.model.rerenderViewModel = rerenderViewModel;

  if (typeof this.model.onload == 'function') {
    var meta = plastiqMeta(this.model);
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

  var vdom = renderViewModel(this.model);

  var meta = plastiqMeta(this.model);
  meta.widgets = meta.widgets || new Widgets();
  meta.widgets.add(this);

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

  if (self.model.onupdate) {
    this.afterRender(function () {
      self.model.onupdate(self.component.element);
    });
  }

  this.component = previous.component;

  var element = this.component.update(renderViewModel(this.model));

  if (self.model.detached) {
    return document.createTextNode('');
  } else {
    return element;
  }
};

ViewModel.prototype.render = function () {
  return renderViewModel(this.model);
};

ViewModel.prototype.refresh = function () {
  this.component.update(renderViewModel(this.model));
  if (this.model.onupdate) {
    this.model.onupdate(this.component.element);
  }
};

ViewModel.prototype.destroy = function (element) {
  var self = this;

  var meta = plastiqMeta(this.model);
  meta.widgets.delete(this);

  if (self.model.onremove) {
    this.afterRender(function () {
      self.model.onremove(element);
    });
  }

  this.component.destroy();
};

module.exports = ViewModel;
