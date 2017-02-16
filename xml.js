var AttributeHook = require('virtual-dom/virtual-hyperscript/hooks/attribute-hook')

var namespaceRegex = /^([a-z0-9-]+)(--|:)([a-z0-9-]+)$/i
var xmlnsRegex = /^xmlns(--|:)([a-z0-9-]+)$/i

function transformProperties(vnode, defaultNamespace, namespaces) {
  var tagNamespace = namespaceRegex.exec(vnode.tagName)
  if (tagNamespace) {
    var namespaceKey = tagNamespace[1]
    var namespace = namespaces[namespaceKey]
    if (namespace) {
      vnode.tagName = tagNamespace[3]
      vnode.namespace = namespace
    }
  } else {
    vnode.namespace = defaultNamespace
  }

  var properties = vnode.properties

  if (properties) {
    var propAttributes = properties.attributes || (properties.attributes = {})

    var keys = Object.keys(properties);
    for (var k = 0, l = keys.length; k < l; k++) {
      var key = keys[k];
      if (key != 'style' && key != 'attributes') {
        var match = namespaceRegex.exec(key)
        if (match) {
          properties[match[3]] = new AttributeHook(namespaces[match[1]], properties[key])
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
  }
}

function declaredNamespaces(vnode) {
  var namespaces = {}
  var keys = Object.keys(vnode.properties)

  for (var k = 0, l = keys.length; k < l; k++) {
    var key = keys[k];

    var match = xmlnsRegex.exec(key)

    if (match) {
      namespaces[match[2]] = vnode.properties[key]
    }
  }

  return namespaces
}

function transform(vnode) {
  var namespaces = declaredNamespaces(vnode)

  function transformChildren(vnode, defaultNamespace, namespaces) {
    transformProperties(vnode, defaultNamespace, namespaces)

    if (vnode.children) {
      for (var c = 0, l = vnode.children.length; c < l; c++) {
        var child = vnode.children[c];
        transformChildren(child, defaultNamespace, namespaces)
      }
    }
  }

  transformChildren(vnode, vnode.properties.xmlns, namespaces)

  return vnode
}

module.exports.transform = transform
