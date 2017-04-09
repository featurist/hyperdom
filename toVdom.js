var Vtext = require('virtual-dom/vnode/vtext.js')
var isVdom = require('./isVdom')
var Component = require('./component')

function toVdom (object) {
  if (object === undefined || object === null) {
    return new Vtext('')
  } else if (typeof (object) !== 'object') {
    return new Vtext(String(object))
  } else if (object instanceof Date) {
    return new Vtext(String(object))
  } else if (object instanceof Error) {
    return new Vtext(object.toString())
  } else if (isVdom(object)) {
    return object
  } else if (typeof object.render === 'function') {
    return new Component(object)
  } else {
    return new Vtext(JSON.stringify(object))
  }
}

module.exports = toVdom

function addChild (children, child) {
  if (child instanceof Array) {
    for (var n = 0; n < child.length; n++) {
      addChild(children, child[n])
    }
  } else {
    children.push(toVdom(child))
  }
}

module.exports.recursive = function (child) {
  var children = []
  addChild(children, child)
  return children
}
