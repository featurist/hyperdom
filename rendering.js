var h = require('virtual-dom/h');
var bind = require('./bind');
var domComponent = require('./domComponent');
var simplePromise = require('./simplePromise');
var coerceToVdom = require('./coerceToVdom');

exports.globalRefresh;

function renderWithRefresh(render, model, refresh) {
  var tree;

  try {
    exports.globalRefresh = refresh;
    tree = render(model);
  } finally {
    exports.globalRefresh = undefined;
  }

  return tree;
}

function doThenFireAfterRender(fn) {
  try {
    exports.renderFinished = simplePromise();

    fn();
  } finally {
    exports.renderFinished.fulfill();
    exports.renderFinished = undefined;
  }
}

exports.attach = function (element, render, model, options) {
  var requestRender = (options && options.requestRender) || window.requestAnimationFrame || setTimeout;
  var requested = false;

  function refresh() {
    if (!requested) {
      requestRender(function () {
        requested = false;

        doThenFireAfterRender(function () {
          var vdom = renderWithRefresh(render, model, refresh);
          component.update(vdom);
        });
      });
      requested = true;
    }
  }

  var component = domComponent();

  doThenFireAfterRender(function () {
    var vdom = renderWithRefresh(render, model, refresh);
    element.appendChild(component.create(vdom));
  });
};

function refreshifyEventHandler(fn) {
  var r = exports.globalRefresh;

  return function () {
    var result = fn.apply(undefined, arguments);
    if (result && typeof(result) == 'function') {
      result(r);
    } else if (result && typeof(result.then) == 'function') {
      result.then(r, r);
    } else {
      r();
      return result;
    }
  };
}

exports.refreshifyEventHandler = refreshifyEventHandler;

function bindTextInput(attributes, children, get, set) {
  var textEventNames = ['onkeydown', 'oninput', 'onpaste', 'textInput'];

  attributes.value = get();

  attachEventHandler(attributes, textEventNames, function (ev) {
    set(ev.target.value);
  });
}

function sequenceFunctions(handler1, handler2) {
  return function (ev) {
    handler1(ev);
    return handler2(ev);
  };
}

function insertEventHandler(attributes, eventName, handler) {
  var previousHandler = attributes[eventName];
  if (previousHandler) {
    attributes[eventName] = sequenceFunctions(handler, previousHandler);
  } else {
    attributes[eventName] = handler;
  }
}

function attachEventHandler(attributes, eventNames, handler) {
  if (eventNames instanceof Array) {
    eventNames.forEach(function (eventName) {
      insertEventHandler(attributes, eventName, handler);
    });
  } else {
    insertEventHandler(attributes, eventNames, handler);
  }
}

function bindModel(attributes, children, type) {
  var inputTypeBindings = {
    text: bindTextInput,
    textarea: bindTextInput,
    checkbox: function (attributes, children, get, set) {
      attributes.checked = get();

      attachEventHandler(attributes, 'onclick', function (ev) {
        set(ev.target.checked);
      });
    },
    radio: function (attributes, children, get, set) {
      var value = attributes.value;
      attributes.checked = get() == attributes.value;

      attachEventHandler(attributes, 'onclick', function (ev) {
        set(value);
      });
    },
    select: function (attributes, children, get, set) {
      var currentValue = get();

      var options = children.filter(function (child) {
        return child.tagName.toLowerCase() == 'option';
      });

      var selectedOption = options.filter(function (child) {
        return child.properties.value == currentValue;
      })[0];

      var values = options.map(function (option) {
        return option.properties.value;
      });

      options.forEach(function (option, index) {
        option.properties.selected = option == selectedOption;
        option.properties.value = index;
      });

      attachEventHandler(attributes, 'onchange', function (ev) {
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

  var binding = inputTypeBindings[type] || bindTextInput;

  var bindingAttr = attributes.binding;
  if (bindingAttr instanceof Array) {
    bindingAttr = bind(bindingAttr[0], bindingAttr[1]);
  }
  binding(attributes, children, bindingAttr.get, refreshifyEventHandler(bindingAttr.set));
}

function inputType(selector, attributes) {
  if (/^textarea\b/i.test(selector)) {
    return 'textarea';
  } else if (/^select\b/i.test(selector)) {
    return 'select';
  } else {
    return attributes.type || 'text';
  }
}

function flatten(array) {
  var flatArray = [];

  function append(array) {
    array.forEach(function(item) {
      if (item instanceof Array) {
        append(item);
      } else {
        flatArray.push(item);
      }
    });
  }

  append(array);

  return flatArray;
}

function coerceChildren(children) {
  return children.map(coerceToVdom);
}

function applyAttributeRenames(attributes) {
  var renames = {
    for: 'htmlFor',
    class: 'className'
  };

  Object.keys(renames).forEach(function (key) {
    if (attributes[key] !== undefined) {
      attributes[renames[key]] = attributes[key];
    }
  });
}

exports.html = function (selector) {
  var attributes;
  var childElements;

  if (arguments[1] && arguments[1].constructor == Object) {
    attributes = arguments[1];
    childElements = coerceChildren(flatten(Array.prototype.slice.call(arguments, 2)));

    Object.keys(attributes).forEach(function (key) {
      if (typeof(attributes[key]) == 'function') {
        attributes[key] = refreshifyEventHandler(attributes[key]);
      }
    });

    applyAttributeRenames(attributes);

    if (attributes.className) {
      attributes.className = generateClassName(attributes.className);
    }

    if (attributes.binding) {
      bindModel(attributes, childElements, inputType(selector, attributes));
    }

    return h.call(undefined, selector, attributes, childElements);
  } else {
    childElements = coerceChildren(flatten(Array.prototype.slice.call(arguments, 1)));
    return h.call(undefined, selector, childElements);
  }
};

function generateClassName(obj) {
  if (typeof(obj) == 'object') {
    if (obj instanceof Array) {
      return obj.join(' ');
    } else {
      return Object.keys(obj).filter(function (key) {
        return obj[key];
      }).join(' ');
    }
  } else {
    return obj;
  }
};
