var rendering = require('./rendering');
var VText = require("virtual-dom/vnode/vtext.js")
var domComponent = require('./domComponent');

function ComponentWidget(handlers, vdom) {
  this.handlers = handlers;
  this.vdom = vdom || new VText('');
  this.component = domComponent();
  this.renderFinished = rendering.renderFinished;
}

ComponentWidget.prototype.type = 'Widget';

ComponentWidget.prototype.init = function () {
  var self = this;
  var element = this.component.create(this.vdom);

  if (self.handlers.onadd) {
    this.renderFinished.then(function () {
      self.handlers.onadd(element);
    });
  }

  return element;
};

ComponentWidget.prototype.update = function (previous, element) {
  var self = this;

  if (self.handlers.onupdate) {
    this.renderFinished.then(function () {
      self.handlers.onupdate(element);
    });
  }

  this.component = previous.component;
  return this.component.update(this.vdom);
};

ComponentWidget.prototype.destroy = function (element) {
  var self = this;

  if (self.handlers.onremove) {
    this.renderFinished.then(function () {
      self.handlers.onremove(element);
    });
  }
};

module.exports = function (handlers, vdom) {
  return new ComponentWidget(handlers, vdom);
};
