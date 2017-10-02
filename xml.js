var AttributeHook = require('virtual-dom/virtual-hyperscript/hooks/attribute-hook')

var namespaceRegex = /^([a-z0-9_-]+)(--|:)([a-z0-9_-]+)$/i
var xmlnsRegex = /^xmlns(--|:)([a-z0-9_-]+)$/i
var SVG_NAMESPACE = 'http://www.w3.org/2000/svg'

function transformTanName (vnode, namespaces) {
  var tagNamespace = namespaceRegex.exec(vnode.tagName)
  if (tagNamespace) {
    var namespaceKey = tagNamespace[1]
    var namespace = namespaces[namespaceKey]
    if (namespace) {
      vnode.tagName = tagNamespace[1] + ':' + tagNamespace[3]
      vnode.namespace = namespace
    }
  } else if (!vnode.namespace) {
    vnode.namespace = namespaces['']
  }
}

function transformProperties (vnode, namespaces) {
  var properties = vnode.properties

  if (properties) {
    var attributes = properties.attributes || (properties.attributes = {})

    var keys = Object.keys(properties)
    for (var k = 0, l = keys.length; k < l; k++) {
      var key = keys[k]
      if (key !== 'style' && key !== 'attributes') {
        var match = namespaceRegex.exec(key)
        if (match) {
          properties[match[1] + ':' + match[3]] = new AttributeHook(namespaces[match[1]], properties[key])
          delete properties[key]
        } else {
          if (vnode.namespace === SVG_NAMESPACE && key === 'className') {
            attributes['class'] = properties.className
            delete properties.className
          } else {
            var property = properties[key]
            var type = typeof property
            if (type === 'string' || type === 'number' || type === 'boolean') {
              attributes[key] = property
            }
          }
        }
      }
    }
  }
}

function declaredNamespaces (vnode) {
  var namespaces = {
    '': vnode.properties.xmlns,
    xmlns: 'http://www.w3.org/2000/xmlns/'
  }

  var keys = Object.keys(vnode.properties)

  for (var k = 0, l = keys.length; k < l; k++) {
    var key = keys[k]
    var value = vnode.properties[key]

    if (key === 'xmlns') {
      namespaces[''] = value
    } else {
      var match = xmlnsRegex.exec(key)

      if (match) {
        namespaces[match[2]] = value
      }
    }
  }

  return namespaces
}

function transform (vnode) {
  var namespaces = declaredNamespaces(vnode)

  function transformChildren (vnode, namespaces) {
    transformTanName(vnode, namespaces)
    transformProperties(vnode, namespaces)

    if (vnode.children) {
      for (var c = 0, l = vnode.children.length; c < l; c++) {
        var child = vnode.children[c]
        if (!(child.properties && child.properties.xmlns)) {
          transformChildren(child, namespaces)
        }
      }
    }
  }

  transformChildren(vnode, namespaces)

  return vnode
}

module.exports.transform = transform
