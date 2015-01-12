var createElement = require('virtual-dom/create-element');
var diff = require('virtual-dom/diff');
var patch = require('virtual-dom/patch');

function DomComponent() {
}

DomComponent.prototype.create = function (vdom) {
  this.vdom = vdom;
  this.element = createElement(vdom);
  return this.element;
};

DomComponent.prototype.update = function (vdom) {
  var patches = diff(this.vdom, vdom);
  this.element = patch(this.element, patches);
  this.vdom = vdom;
};

function domComponent() {
  return new DomComponent();
}

module.exports = domComponent;
