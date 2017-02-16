var listener = require('./listener');
var binding = require('./binding')

module.exports = function(tag, attributes, children) {
  var type = inputType(tag, attributes)
  var bind = inputTypeBindings[type] || bindTextInput;

  var bindingAttr = binding(attributes.binding);
  bind(attributes, children, bindingAttr.get, bindingAttr.set);
}

var inputTypeBindings = {
  text: bindTextInput,

  textarea: bindTextInput,

  checkbox: function (attributes, children, get, set) {
    attributes.checked = get();

    attachEventHandler(attributes, 'onclick', function (ev) {
      attributes.checked = ev.target.checked;
      set(ev.target.checked);
    });
  },

  radio: function (attributes, children, get, set) {
    var value = attributes.value;
    attributes.checked = get() == attributes.value;
    attributes.on_hyperdomsyncchecked = listener(function (event) {
      attributes.checked = event.target.checked;
    });

    attachEventHandler(attributes, 'onclick', function (event) {
      var name = event.target.name;
      if (name) {
        var inputs = document.getElementsByName(name);
        for (var i = 0, l = inputs.length; i < l; i++) {
          inputs[i].dispatchEvent(customEvent('_hyperdomsyncchecked'));
        }
      }
      set(value);
    });
  },

  select: function (attributes, children, get, set) {
    var currentValue = get();

    var options = children.filter(function (child) {
      return child.tagName.toLowerCase() == 'option';
    });

    var values = [];
    var selectedIndex;

    for(var n = 0; n < options.length; n++) {
      var option = options[n];
      var hasValue = option.properties.hasOwnProperty('value');
      var value = option.properties.value;
      var text = option.children.map(function (x) { return x.text; }).join('');

      values.push(hasValue? value: text);

      var selected = value == currentValue || text == currentValue;

      if (selected) {
        selectedIndex = n;
      }

      option.properties.selected = selected;
      option.properties.value = n;
    }

    if (selectedIndex !== undefined) {
      attributes.selectedIndex = selectedIndex;
    }

    attachEventHandler(attributes, 'onchange', function (ev) {
      attributes.selectedIndex = ev.target.selectedIndex;
      set(values[ev.target.value]);
    });
  },

  file: function (attributes, children, get, set) {
    var multiple = attributes.multiple;

    attachEventHandler(attributes, 'onchange', function (ev) {
      if (multiple) {
        set(ev.target.files);
      } else {
        set(ev.target.files[0]);
      }
    });
  }
};

function inputType(selector, attributes) {
  if (/^textarea\b/i.test(selector)) {
    return 'textarea';
  } else if (/^select\b/i.test(selector)) {
    return 'select';
  } else {
    return attributes.type || 'text';
  }
}

function bindTextInput(attributes, children, get, set) {
  var textEventNames = ['onkeyup', 'oninput', 'onpaste', 'textInput'];

  var bindingValue = get();
  if (!(bindingValue instanceof Error)) {
    attributes.value = bindingValue != undefined? bindingValue: '';
  }

  attachEventHandler(attributes, textEventNames, function (ev) {
    if (get() != ev.target.value) {
      set(ev.target.value);
    }
  });
}

function attachEventHandler(attributes, eventNames, handler) {
  if (eventNames instanceof Array) {
    for (var n = 0; n < eventNames.length; n++) {
      insertEventHandler(attributes, eventNames[n], handler);
    }
  } else {
    insertEventHandler(attributes, eventNames, handler);
  }
}

function insertEventHandler(attributes, eventName, handler) {
  var previousHandler = attributes[eventName];
  if (previousHandler) {
    attributes[eventName] = sequenceFunctions(handler, previousHandler);
  } else {
    attributes[eventName] = handler;
  }
}

function sequenceFunctions(handler1, handler2) {
  return function (ev) {
    handler1(ev);
    return handler2(ev);
  };
}

function customEvent(name) {
  if (typeof Event == 'function') {
    return new Event(name);
  } else {
    var event = document.createEvent('Event');
    event.initEvent(name, false, false);
    return event;
  }
}
