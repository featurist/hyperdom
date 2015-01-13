var domComponent = require('./domComponent');

function ComponentWidget(render) {
  this.render = render;
  this.component = domComponent();
}

ComponentWidget.prototype.type = 'Widget';

ComponentWidget.prototype.init = function () {
  return this.component.create(this.render());
};

ComponentWidget.prototype.update = function () {
  return this.component.update(this.render());
};

module.exports = ComponentWidget;
