var rendering = require('./rendering');
var VText = require("virtual-dom/vnode/vtext.js")
var domComponent = require('./domComponent');

function ComponentWidget(state, vdom) {
  this.state = state;
  this.key = state.key;
  if (typeof vdom === 'function') {
    this.render = vdom;
    this.canRefresh = true;
  } else {
    vdom = vdom || new VText('');
    this.render = function () {
      return vdom;
    }
  }
  this.component = domComponent();
  this.renderFinished = rendering.currentRender.finished;
}

ComponentWidget.prototype.type = 'Widget';

ComponentWidget.prototype.init = function () {
  var self = this;
  var element = this.component.create(this.render(this));

  if (self.state.onadd) {
    this.renderFinished.then(function () {
      self.state.onadd(element);
    });
  }

  if (self.state.detached) {
    return document.createTextNode('');
  } else {
    return element;
  }
};

ComponentWidget.prototype.update = function (previous) {
  var self = this;

  if (self.state.onupdate) {
    this.renderFinished.then(function () {
      self.state.onupdate(self.component.element);
    });
  }

  this.component = previous.component;
  
  if (previous.state && this.state) {
    Object.keys(this.state).forEach(function (key) {
      previous.state[key] = self.state[key];
    });
    this.state = previous.state;
  }

  var element = this.component.update(this.render(this));

  if (self.state.detached) {
    return document.createTextNode('');
  } else {
    return element;
  }
};

ComponentWidget.prototype.destroy = function (element) {
  var self = this;

  if (self.state.onremove) {
    this.renderFinished.then(function () {
      self.state.onremove(element);
    });
  }

  this.component.destroy();
};

module.exports = function (state, vdom) {
  if (typeof state === 'function') {
    return new ComponentWidget({}, state);
  } else if (state.constructor === Object) {
    return new ComponentWidget(state, vdom);
  } else {
    return new ComponentWidget({}, state);
  }
};

module.exports.ComponentWidget = ComponentWidget;
