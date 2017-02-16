var hyperdom = require('.');
var bindModel = require('./bindModel')
var refreshify = require('./refreshify')

module.exports = function(tag, attributes, childElements) {
  var keys = Object.keys(attributes);
  var dataset;
  var currentRender = hyperdom.currentRender();
  var eventHandlerWrapper = currentRender && currentRender.eventHandlerWrapper;

  for (var k = 0; k < keys.length; k++) {
    var key = keys[k];
    var attribute = attributes[key];

    if (typeof(attribute) == 'function') {
      if (eventHandlerWrapper) {
        var fn = eventHandlerWrapper.call(undefined, key.replace(/^on/, ''), attribute);
        attributes[key] = typeof fn === 'function'? refreshify(fn): fn;
      } else {
        attributes[key] = refreshify(attribute);
      }
    }

    var rename = renames[key];
    if (rename) {
      attributes[rename] = attribute;
      delete attributes[key];
      continue;
    }

    if (dataAttributeRegex.test(key)) {
      if (!dataset) {
        dataset = attributes.dataset;

        if (!dataset) {
          dataset = attributes.dataset = {};
        }
      }

      var datakey = key
        .replace(dataAttributeRegex, '')
        .replace(/-([a-z])/ig, function(_, x) { return x.toUpperCase(); });

      dataset[datakey] = attribute;
      delete attributes[key];
      continue;
    }
  }

  if (attributes.__source) {
    if (!dataset) {
      dataset = attributes.dataset;

      if (!dataset) {
        dataset = attributes.dataset = {};
      }
    }

    dataset.fileName = attributes.__source.fileName;
    dataset.lineNumber = attributes.__source.lineNumber;
  }

  if (attributes.className) {
    attributes.className = generateClassName(attributes.className);
  }

  if (attributes.binding) {
    bindModel(tag, attributes, childElements);
    delete attributes.binding;
  }

  return attributes
}

var renames = {
  for: 'htmlFor',
  class: 'className',
  contenteditable: 'contentEditable',
  tabindex: 'tabIndex',
  colspan: 'colSpan'
};

var dataAttributeRegex = /^data-/;

function generateClassName(obj) {
  if (typeof(obj) == 'object') {
    if (obj instanceof Array) {
      var names = obj.map(function(item) {
        return generateClassName(item);
      });
      return names.join(' ') || undefined;
    } else {
      return generateConditionalClassNames(obj);
    }
  } else {
    return obj;
  }
}

function generateConditionalClassNames(obj) {
  return Object.keys(obj).filter(function (key) {
    return obj[key];
  }).join(' ') || undefined;
}
