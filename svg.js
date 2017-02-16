var VNode = require('virtual-dom/vnode/vnode.js')
var toVdom = require('./toVdom')
var prepareAttributes = require('./prepareAttributes')
var AttributeHook = require('virtual-dom/virtual-hyperscript/hooks/attribute-hook')

var namespaceRegex = /^([a-z0-9-]+)--([a-z0-9-]+)$/i

module.exports = function (_tag, attributes) {
  var tag
  var namespace

  var tagNamespace = namespaceRegex.exec(_tag)
  if (tagNamespace) {
    var namespaceKey = tagNamespace[1]
    namespace = namespaces[namespaceKey]
    if (!namespace) {
      console.log(namespaceKey)
    }
    tag = tagNamespace[2]
  } else {
    namespace = "http://www.w3.org/2000/svg"
    tag = _tag
  }

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
      var match = namespaceRegex.exec(key)
      if (match) {
        properties[match[2]] = new AttributeHook(namespaces[match[1]], properties[key])
        delete properties[key]
      } else {
        var property = properties[key];
        var type = typeof property;
        if (type === 'string' || type === 'number' || type === 'boolean') {
          propAttributes[key] = property;
        }
      }
    }
  }

  return new VNode(tag, properties, children, vdomKey, namespace);
}

var namespaces = {
  rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns',
  xlink: 'http://www.w3.org/1999/xlink',
  sodipodi: 'http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd',
  inkscape: 'http://www.inkscape.org/namespaces/inkscape',
  dc: 'http://purl.org/dc/elements/1.1/',
  cc: 'http://creativecommons.org/ns'
}
