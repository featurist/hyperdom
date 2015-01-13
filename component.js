var rendering = require('./rendering');
var VText = require("virtual-dom/vnode/vtext.js")
var domComponent = require('./domComponent');
var ComponentWidget = require('./componentWidget');

function LifetimeWidget(handlers, vdom) {
  this.handlers = handlers;
  this.vdom = vdom || new VText('');
  this.component = domComponent();
  this.renderFinished = rendering.renderFinished;
}

LifetimeWidget.prototype.type = 'Widget';

LifetimeWidget.prototype.init = function () {
  var self = this;
  var element = this.component.create(this.vdom);

  if (self.handlers.onadd) {
    this.renderFinished.then(function () {
      self.handlers.onadd(element);
    });
  }

  return element;
};

LifetimeWidget.prototype.update = function (previous, element) {
  var self = this;

  if (self.handlers.onupdate) {
    this.renderFinished.then(function () {
      self.handlers.onupdate(element);
    });
  }

  this.component = previous.component;
  return this.component.update(this.vdom);
};

LifetimeWidget.prototype.destroy = function (element) {
  var self = this;

  if (self.handlers.onremove) {
    this.renderFinished.then(function () {
      self.handlers.onremove(element);
    });
  }
};

module.exports = function (handlers, vdom) {
  if (typeof handlers === 'function') {
    return new ComponentWidget(handlers);
  } else if (typeof handlers === 'object' && typeof vdom === 'function') {
    return new ComponentWidget(function () {
      return new LifetimeWidget(handlers, vdom());
    });
  } else {
    return new LifetimeWidget(handlers, vdom);
  }
};

module.exports.ComponentWidget = ComponentWidget;
