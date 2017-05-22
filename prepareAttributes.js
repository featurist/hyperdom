var render = require('./render')
var bindModel = require('./bindModel')

module.exports = function (tag, attributes, childElements) {
  var dataset
  var currentRender = render.currentRender()

  if (attributes.binding) {
    bindModel(tag, attributes, childElements)
    delete attributes.binding
  }

  var keys = Object.keys(attributes)
  for (var k = 0; k < keys.length; k++) {
    var key = keys[k]
    var attribute = attributes[key]

    if (typeof (attribute) === 'function' && currentRender) {
      attributes[key] = currentRender.transformFunctionAttribute(key, attribute)
    }

    var rename = renames[key]
    if (rename) {
      attributes[rename] = attribute
      delete attributes[key]
      continue
    }

    if (dataAttributeRegex.test(key)) {
      if (!dataset) {
        dataset = attributes.dataset

        if (!dataset) {
          dataset = attributes.dataset = {}
        }
      }

      var datakey = key
        .replace(dataAttributeRegex, '')
        .replace(/-([a-z])/ig, function (_, x) { return x.toUpperCase() })

      dataset[datakey] = attribute
      delete attributes[key]
      continue
    }
  }

  if (process.env.NODE_ENV !== 'production' && attributes.__source) {
    if (!dataset) {
      dataset = attributes.dataset

      if (!dataset) {
        dataset = attributes.dataset = {}
      }
    }

    dataset.fileName = attributes.__source.fileName
    dataset.lineNumber = attributes.__source.lineNumber
  }

  if (attributes.className) {
    attributes.className = generateClassName(attributes.className)
  }

  return attributes
}

var renames = {
  for: 'htmlFor',
  class: 'className',
  contenteditable: 'contentEditable',
  tabindex: 'tabIndex',
  colspan: 'colSpan'
}

var dataAttributeRegex = /^data-/

function generateClassName (obj) {
  if (typeof (obj) === 'object') {
    if (obj instanceof Array) {
      var names = obj.map(function (item) {
        return generateClassName(item)
      })
      return names.join(' ') || undefined
    } else {
      return generateConditionalClassNames(obj)
    }
  } else {
    return obj
  }
}

function generateConditionalClassNames (obj) {
  return Object.keys(obj).filter(function (key) {
    return obj[key]
  }).join(' ') || undefined
}
