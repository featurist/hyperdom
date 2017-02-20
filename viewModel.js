var domComponent = require('./domComponent');
var hyperdomMeta = require('./meta');
var render = require('./render');

function ViewModel(model, options) {
  var currentRender = render.currentRender();

  this.isComponent = options && options.hasOwnProperty('component') && options.component
  this.currentRender = currentRender;
  this.model = model;
  this.key = model.renderKey;
  this.component = undefined;
  this.mount = currentRender.mount;
}

ViewModel.prototype.type = 'Widget';

ViewModel.prototype.init = function () {
  var self = this;

  var vdom = this.render();

  var meta = hyperdomMeta(this.model);
  meta.widgets.add(this);

  this.component = domComponent.create();
  var element = this.component.create(vdom);

  if (self.model.onbeforeadd) {
    self.model.onbeforeadd()
  }

  if (self.model.onadd) {
    this.currentRender.finished.then(function () {
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

  if (this.isComponent) {
    var keys = Object.keys(this.model);
    for(var n = 0; n < keys.length; n++) {
      var key = keys[n];
      previous.model[key] = self.model[key];
    }
    this.model = previous.model;
  }

  if (self.model.onupdate) {
    this.currentRender.finished.then(function () {
      self.model.onupdate(self.component.element);
    });
  }

  this.component = previous.component;

  if (self.model.onbeforeupdate) {
    self.model.onbeforeupdate(this.component.element)
  }

  var element = this.component.update(this.render());

  if (self.model.detached) {
    return document.createTextNode('');
  } else {
    return element;
  }
};

ViewModel.prototype.render = function () {
  return this.mount.renderViewModel(this.model);
};

ViewModel.prototype.rerender = function () {
  this.component.update(this.render());
  if (this.model.onupdate) {
    this.model.onupdate(this.component.element);
  }
};

ViewModel.prototype.destroy = function (element) {
  var self = this;

  var meta = hyperdomMeta(this.model);
  meta.widgets.delete(this);

  if (self.model.onbeforeremove) {
    self.model.onbeforeremove(element)
  }

  if (self.model.onremove) {
    this.currentRender.finished.then(function () {
      self.model.onremove(element);
    });
  }

  this.component.destroy();
};

module.exports = ViewModel;
