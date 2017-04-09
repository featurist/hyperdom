var refreshify = require('./render').refreshify

function ListenerHook (listener) {
  this.listener = refreshify(listener)
}

ListenerHook.prototype.hook = function (element, propertyName) {
  element.addEventListener(propertyName.substring(2), this.listener, false)
}

ListenerHook.prototype.unhook = function (element, propertyName) {
  element.removeEventListener(propertyName.substring(2), this.listener)
}

module.exports = function (listener) {
  return new ListenerHook(listener)
}
