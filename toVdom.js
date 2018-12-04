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
    return new Vtext(objectAsString(object))
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

function objectAsString (object) {
  var string
  if (typeof object.toString === 'function') {
    string = object.toString()
  }
  if (string === '[object Object]') {
    try {
      string = JSON.stringify(object)
    } catch (_) {}
  }
  return string
}

module.exports.recursive = function (child) {
  var children = []
  addChild(children, child)
  return children
}
