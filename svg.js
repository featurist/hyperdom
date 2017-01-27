var VNode = require('virtual-dom/vnode/vnode.js')
var toVdom = require('./toVdom')
var prepareAttributes = require('./prepareAttributes')

module.exports = function (tag, attributes) {
  var children = toVdom.recursive(Array.prototype.slice.call(arguments, 2));
  var properties = attributes? prepareAttributes(tag, attributes, children): {}

  if (properties.hasOwnProperty('key')) {
    var vdomKey = properties.key;
    properties.key = undefined;
  }

  var propAttributes = properties.attributes || (properties.attributes = {})

  var keys = Object.keys(properties);
  for (var k = 0, l = keys.length; k < l; k++) {
    var key = keys[k];
    if (key != 'style' && key != 'attributes') {
      var property = properties[key];
      var type = typeof property;
      if (type === 'string' || type === 'number' || type === 'boolean') {
        propAttributes[key] = property;
      }
    }
  }

  return new VNode(tag, properties, children, vdomKey, "http://www.w3.org/2000/svg");
}
