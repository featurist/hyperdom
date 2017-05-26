var runRender = require('./render')
var PropertyHook = require('./propertyHook')
var VirtualNode = require('virtual-dom/vnode/vnode')

module.exports = function (vdom, model) {
  if (process.env.NODE_ENV !== 'production' && vdom && vdom.constructor === VirtualNode) {
    if (!vdom.properties) {
      vdom.properties = {}
    }

    vdom.properties._hyperdomMeta = new PropertyHook({
      component: model,
      render: runRender.currentRender()
    })
  }

  return vdom
}
