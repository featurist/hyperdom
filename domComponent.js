var createElement = require('virtual-dom/create-element');
var diff = require('virtual-dom/diff');
var patch = require('virtual-dom/patch');
var coerceChildren = require('./coerceChildren');
var isVnode = require('virtual-dom/vnode/is-vnode');
var isWidget = require('virtual-dom/vnode/is-widget');

function DomComponent(options) {
  this.document = options && options.document;
}

function checkVdom(vdom) {
  if (!isVnode(vdom) && !isWidget(vdom)) {
    throw new Error('expected render to return vdom');
  }
}

DomComponent.prototype.create = function (vdom) {
  this.vdom = coerceChildren.toVdom(vdom);
  checkVdom(this.vdom);
  return this.element = createElement(this.vdom, {document: this.document});
};

DomComponent.prototype.merge = function (vdom, element) {
  this.vdom = coerceChildren.toVdom(vdom);
  checkVdom(this.vdom);
  return this.element = element;
};

DomComponent.prototype.update = function (vdom) {
  var patches = diff(this.vdom, coerceChildren.toVdom(vdom));
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

function domComponent(options) {
  return new DomComponent(options);
}

module.exports = domComponent;
