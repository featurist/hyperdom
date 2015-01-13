var rendering = require('./rendering');

function AnimationWidget(fn) {
  this.fn = fn;
  this.refresh = rendering.globalRefresh;
}

AnimationWidget.prototype.type = 'Widget';

AnimationWidget.prototype.init = function () {
  this.fn(this.refresh);
  return document.createTextNode('');
};

AnimationWidget.prototype.update = function () {
};

AnimationWidget.prototype.destroy = function () {
};

module.exports = function (fn) {
  return new AnimationWidget(fn);
};
