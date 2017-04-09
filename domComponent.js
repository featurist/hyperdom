var createElement = require('virtual-dom/create-element')
var diff = require('virtual-dom/diff')
var patch = require('virtual-dom/patch')
var toVdom = require('./toVdom')
var isVdom = require('./isVdom')

function DomComponent (options) {
  this.document = options && options.document
}

function prepareVdom (object) {
  var vdom = toVdom(object)
  if (!isVdom(vdom)) {
    throw new Error('expected render to return vdom')
  } else {
    return vdom
  }
}

DomComponent.prototype.create = function (vdom) {
  this.vdom = prepareVdom(vdom)
  return (this.element = createElement(this.vdom, {document: this.document}))
}

DomComponent.prototype.merge = function (vdom, element) {
  this.vdom = prepareVdom(vdom)
  return (this.element = element)
}

DomComponent.prototype.update = function (vdom) {
  var oldVdom = this.vdom
  this.vdom = prepareVdom(vdom)
  var patches = diff(oldVdom, this.vdom)
  return (this.element = patch(this.element, patches))
}

DomComponent.prototype.destroy = function (options) {
  function destroyWidgets (vdom) {
    if (vdom.type === 'Widget') {
      vdom.destroy()
    } else if (vdom.children) {
      vdom.children.forEach(destroyWidgets)
    }
  }

  destroyWidgets(this.vdom)

  if (options && options.removeElement && this.element.parentNode) {
    this.element.parentNode.removeChild(this.element)
  }
}

function domComponent (options) {
  return new DomComponent(options)
}

exports.create = domComponent
