'use strict'

var VNode = require('virtual-dom/vnode/vnode.js')
var isHook = require('virtual-dom/vnode/is-vhook')
var xml = require('./xml')

var softSetHook = require('virtual-dom/virtual-hyperscript/hooks/soft-set-hook.js')

module.exports = h

function h (tagName, props, children) {
  var tag = tagName

  // support keys
  if (props.hasOwnProperty('key')) {
    var key = props.key
    props.key = undefined
  }

  // support namespace
  if (props.hasOwnProperty('namespace')) {
    var namespace = props.namespace
    props.namespace = undefined
  }

  // fix cursor bug
  if (tag.toLowerCase() === 'input' &&
    !namespace &&
    props.hasOwnProperty('value') &&
    props.value !== undefined &&
    !isHook(props.value)
  ) {
    props.value = softSetHook(props.value)
  }

  var vnode = new VNode(tag, props, children, key, namespace)

  if (props.xmlns) {
    xml.transform(vnode)
  }

  return vnode
}
