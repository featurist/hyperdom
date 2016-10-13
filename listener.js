var hyperdom = require('./index');

function ListenerHook(listener) {
  this.listener = hyperdom.refreshify(listener);
}

ListenerHook.prototype.hook = function (element, propertyName) {
  element.addEventListener(propertyName.substring(2), this.listener, false);
};

ListenerHook.prototype.unhook = function (element, propertyName) {
  element.removeEventListener(propertyName.substring(2), this.listener);
};

module.exports = function (listener) {
  return new ListenerHook(listener);
};
