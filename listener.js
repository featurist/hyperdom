var rendering = require('./rendering');

function ListenerHook(listener) {
  this.listener = rendering.refreshifyEventHandler(listener);
}

ListenerHook.prototype.hook = function (element, propertyName, previous) {
  if (previous) {
    element.removeEventListener(propertyName.substring(2), previous.listener, false);
  }
  element.addEventListener(propertyName.substring(2), this.listener, false);
};

ListenerHook.prototype.unhook = function (element, propertyName) {
  element.removeEventListener(propertyName.substring(2), this.listener, false);
};

module.exports = function (listener) {
  return new ListenerHook(listener);
};
