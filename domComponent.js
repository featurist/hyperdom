var createElement = require('virtual-dom/create-element');
var diff = require('virtual-dom/diff');
var patch = require('virtual-dom/patch');
var isVnode = require('virtual-dom/vnode/is-vnode');
var isWidget = require('virtual-dom/vnode/is-widget');

function DomComponent() {
}

DomComponent.prototype.create = function (vdom) {
  if (!isVnode(vdom) && !isWidget(vdom)) {
    throw new Error('expected render to return vdom');
  }
  this.vdom = vdom;
  this.element = createElement(this.vdom);
  return this.element;
};

DomComponent.prototype.update = function (vdom) {
  var patches = diff(this.vdom, vdom);
  this.element = patch(this.element, patches);
  this.vdom = vdom;
  return this.element;
};

DomComponent.prototype.destroy = function (options) {
  function destroyWidgets(vdom) {
    if (vdom.type === 'Widget') {
      vdom.destroy();
    } else if (vdom.children) {
      vdom.children.forEach(destroyWidgets);
    }
  }

  destroyWidgets(this.vdom);

  if (options && options.removeElement && this.element.parentNode) {
    this.element.parentNode.removeChild(this.element);
  }
};

function domComponent() {
  return new DomComponent();
}

module.exports = domComponent;
