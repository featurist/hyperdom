function PropertyHook (value) {
  this.value = value
}

PropertyHook.prototype.hook = function (element, property) {
  element[property] = this.value
}

PropertyHook.prototype.unhook = function (element, property) {
  delete element[property]
}

module.exports = PropertyHook
