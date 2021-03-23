var listener = require('./listener')
var binding = require('./binding')
var RefreshHook = require('./render').RefreshHook

module.exports = function (tag, attributes, children) {
  var type = inputType(tag, attributes)
  var bind = inputTypeBindings[type] || bindTextInput

  bind(attributes, children, binding(attributes.binding))
}

var inputTypeBindings = {
  text: bindTextInput,

  textarea: bindTextInput,

  checkbox: function (attributes, children, binding) {
    attributes.checked = binding.get()

    attachEventHandler(attributes, 'onclick', function (ev) {
      attributes.checked = ev.target.checked
      return binding.set(ev.target.checked)
    }, binding)
  },

  radio: function (attributes, children, binding) {
    var value = attributes.value
    attributes.checked = binding.get() === attributes.value
    attributes.on_hyperdomsyncchecked = listener(function (event) {
      attributes.checked = event.target.checked
    })

    attachEventHandler(attributes, 'onclick', function (event) {
      var name = event.target.name
      if (name) {
        var inputs = document.getElementsByName(name)
        for (var i = 0, l = inputs.length; i < l; i++) {
          inputs[i].dispatchEvent(customEvent('_hyperdomsyncchecked'))
        }
      }
      return binding.set(value)
    }, binding)
  },

  select: function (attributes, children, binding) {
    var currentValue = binding.get()

    var options = []
    var tagName
    children.forEach(function (child) {
      tagName = child.tagName && child.tagName.toLowerCase()

      switch (tagName) {
        case 'optgroup':
          child.children.forEach(function (optChild) {
            if (optChild.tagName && optChild.tagName.toLowerCase() === 'option') {
              options.push(optChild)
            }
          })
          break
        case 'option':
          options.push(child)
          break
      }
    })

    var values = []

    var valueSelected = attributes.multiple
      ? function (value) { return currentValue instanceof Array && currentValue.indexOf(value) >= 0 }
      : function (value) { return currentValue === value }

    for (var n = 0; n < options.length; n++) {
      var option = options[n]
      var hasValue = option.properties.hasOwnProperty('value')
      var value = option.properties.value
      var text = option.children.map(function (x) { return x.text }).join('')

      values.push(hasValue ? value : text)

      var selected = valueSelected(hasValue ? value : text)

      option.properties.selected = selected
    }

    attachEventHandler(attributes, 'onchange', function (ev) {
      if (ev.target.multiple) {
        var options = ev.target.options

        var selectedValues = []

        for (var n = 0; n < options.length; n++) {
          var op = options[n]
          if (op.selected) {
            selectedValues.push(values[n])
          }
        }
        return binding.set(selectedValues)
      } else {
        attributes.selectedIndex = ev.target.selectedIndex
        return binding.set(values[ev.target.selectedIndex])
      }
    }, binding)
  },

  file: function (attributes, children, binding) {
    var multiple = attributes.multiple

    attachEventHandler(attributes, 'onchange', function (ev) {
      if (multiple) {
        return binding.set(ev.target.files)
      } else {
        return binding.set(ev.target.files[0])
      }
    }, binding)
  }
}

function inputType (selector, attributes) {
  if (/^textarea\b/i.test(selector)) {
    return 'textarea'
  } else if (/^select\b/i.test(selector)) {
    return 'select'
  } else {
    return attributes.type || 'text'
  }
}

function bindTextInput (attributes, children, binding) {
  var textEventNames = ['onkeyup', 'oninput', 'onpaste', 'textInput']

  var bindingValue = binding.get()
  if (!(bindingValue instanceof Error)) {
    attributes.value = bindingValue !== undefined ? bindingValue : ''
  }

  attachEventHandler(attributes, textEventNames, function (ev) {
    if (binding.get() !== ev.target.value) {
      return binding.set(ev.target.value)
    }
  }, binding)
}

function attachEventHandler (attributes, eventNames, handler) {
  if (eventNames instanceof Array) {
    for (var n = 0; n < eventNames.length; n++) {
      insertEventHandler(attributes, eventNames[n], handler)
    }
  } else {
    insertEventHandler(attributes, eventNames, handler)
  }
}

function insertEventHandler (attributes, eventName, handler) {
  var previousHandler = attributes[eventName]
  if (previousHandler) {
    attributes[eventName] = sequenceFunctions(handler, previousHandler)
  } else {
    attributes[eventName] = handler
  }
}

function sequenceFunctions (handler1, handler2) {
  return function (ev) {
    handler1(ev)
    if (handler2 instanceof RefreshHook) {
      return handler2.handler(ev)
    } else {
      return handler2(ev)
    }
  }
}

function customEvent (name) {
  if (typeof Event === 'function') {
    return new window.Event(name)
  } else {
    var event = document.createEvent('Event')
    event.initEvent(name, false, false)
    return event
  }
}
