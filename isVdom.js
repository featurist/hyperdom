var virtualDomVersion = require('virtual-dom/vnode/version')

module.exports = function (x) {
  var type = x.type
  if (type === 'VirtualNode' || type === 'VirtualText') {
    return x.version === virtualDomVersion
  } else {
    return type === 'Widget' || type === 'Thunk'
  }
}
