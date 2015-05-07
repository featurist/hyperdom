var h = require('virtual-dom/h');
var domComponent = require('./domComponent');
var simplePromise = require('./simplePromise');
var coerceToVdom = require('./coerceToVdom');

exports.currentRender;

function doThenFireAfterRender(render, fn) {
  try {
    exports.currentRender = render;
    exports.currentRender.finished = simplePromise();
    exports.html.refresh = function (component) {
      if (component) {
        refreshComponent(component, render.requestRender);
      } else {
        render.refresh();
      }
    }

    fn();
  } finally {
    exports.currentRender.finished.fulfill();
    exports.currentRender.finished = undefined;
    exports.currentRender = undefined;
    exports.html.refresh = refreshOutOfRender;
  }
}

function refreshOutOfRender() {
  throw new Error('please assign plastiq.html.refresh during a render cycle if you want to use it in event handlers');
}

exports.append = function (element, render, model, options) {
  return start(render, model, options, function(createdElement) {
    element.appendChild(createdElement);
  });
};

function start(render, model, options, attachToDom) {
  var win = (options && options.window) || window;
  var requestRender = (options && options.requestRender) || win.requestAnimationFrame || win.setTimeout;
  var requested = false;
  var detached = false;

  function refresh() {
    if (!requested) {
      requestRender(function () {
        requested = false;

        if (!detached) {
          doThenFireAfterRender(attachment, function () {
            var vdom = render(model);
            component.update(vdom);
          });
        }
      });
      requested = true;
    }
  }

  var attachment = {
    refresh: refresh,
    requestRender: requestRender
  }

  var component = domComponent();

  doThenFireAfterRender(attachment, function () {
    var vdom = render(model);
    attachToDom(component.create(vdom));
  });

  return {
    detach: function () {
      detached = true;
    },
    remove: function () {
      component.destroy({removeElement: true});
      detached = true;
    }
  };
};

exports.replace = function (element, render, model, options) {
  return start(render, model, options, function(createdElement) {
    var parent = element.parentNode;
    element.parentNode.replaceChild(createdElement, element);
  });
};

exports.attach = function () {
  console.warn('plastiq.attach has been renamed to plastiq.append, plastiq.attach will be deprecated in a future version');
  return exports.append.apply(this, arguments);
}

function refreshComponent(component, requestRender) {
  if (!component.canRefresh) {
    throw new Error("this component cannot be refreshed, make sure that the component's view is returned from a function");
  }

  if (!component.requested) {
    requestRender(function () {
      component.requested = false;
      component.update(component);
    });
    component.requested = true;
  }
}

var norefresh = {};

function refreshify(fn, options) {
  if (!exports.currentRender) {
    return fn;
  }

  var onlyRefreshAfterPromise = options && options.refresh == 'promise';

  if (options && (options.norefresh == true || options.refresh == false)) {
    return fn;
  }

  var requestRender = exports.currentRender.requestRender;
  var r = exports.currentRender.refresh;

  if (!r) {
    throw new Error('no global refresh!');
  }

  return function () {
    var result = fn.apply(this, arguments);

    function handleResult(result, promiseResult) {
      var allowRefresh = !onlyRefreshAfterPromise || promiseResult;

      if (allowRefresh && result && typeof(result) == 'function') {
        console.warn('animations are now deprecated, you should consider using plastiq.html.refresh');
        result(r);
      } else if (result && typeof(result.then) == 'function') {
        if (allowRefresh) {
          r();
        }
        result.then(function (result) { handleResult(result, onlyRefreshAfterPromise); });
      } else if (
          result
          && typeof result.init === 'function'
          && typeof result.update === 'function'
          && typeof result.destroy === 'function') {
        refreshComponent(result, requestRender);
      } else if (result === norefresh) {
        // don't refresh;
      } else if (allowRefresh) {
        r();
        return result;
      }
    }

    return handleResult(result);
  };
}

function bindTextInput(attributes, children, get, set) {
  var textEventNames = ['onkeydown', 'oninput', 'onpaste', 'textInput'];

  var bindingValue = get();
  attributes.value = bindingValue != undefined? bindingValue: '';

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

function insertEventHandler(attributes, eventName, handler, after) {
  var previousHandler = attributes[eventName];
  if (previousHandler) {
    if (after) {
      attributes[eventName] = sequenceFunctions(previousHandler, handler);
    } else {
      attributes[eventName] = sequenceFunctions(handler, previousHandler);
    }
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

  var bind = inputTypeBindings[type] || bindTextInput;

  var bindingAttr = makeBinding(attributes.binding);
  bind(attributes, children, bindingAttr.get, bindingAttr.set);
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
      delete attributes[key];
    }
  });
}

exports.html = function (selector) {
  var selectorElements = selector.match(/\S+/g);
  selector = selectorElements[selectorElements.length - 1];

  function createElementHierarchy(leaf) {
    if (selectorElements.length > 1) {
      var selectorElement = selectorElements.shift();
      return h(selectorElement, createElementHierarchy(leaf));
    } else {
      return leaf;
    }
  }

  var attributes;
  var childElements;

  if (arguments[1] && arguments[1].constructor == Object) {
    attributes = arguments[1];
    childElements = coerceChildren(flatten(Array.prototype.slice.call(arguments, 2)));

    Object.keys(attributes).forEach(function (key) {
      if (typeof(attributes[key]) == 'function') {
        attributes[key] = refreshify(attributes[key]);
      }
    });

    applyAttributeRenames(attributes);

    if (attributes.className) {
      attributes.className = generateClassName(attributes.className);
    }

    if (attributes.binding) {
      bindModel(attributes, childElements, inputType(selector, attributes));
      delete attributes.binding;
    }

    return createElementHierarchy(h(selector, attributes, childElements));
  } else {
    childElements = coerceChildren(flatten(Array.prototype.slice.call(arguments, 1)));
    return createElementHierarchy(h(selector, childElements));
  }
};

exports.html.refreshify = refreshify;
exports.html.refresh = refreshOutOfRender;
exports.html.norefresh = norefresh;

function makeBinding(b, options) {
  var binding = b instanceof Array
    ?  bindingObject.apply(undefined, b)
    : b;

  binding.set = refreshify(binding.set, options);

  return binding;
};

function bindingObject(obj, prop, options) {
  var set =
    options && (typeof options === 'function'
    ? options
    : options.set);

  var get = options && options.get;

  return {
    get: function () {
      var value = obj[prop];

      if (get) {
        return get(value);
      } else {
        return value;
      }
    },
    set: function (value) {
      if (set) {
        value = set(value);
      }

      obj[prop] = value;
    }
  };
};

exports.binding = makeBinding;
exports.html.binding = makeBinding;

function generateClassName(obj) {
  if (typeof(obj) == 'object') {
    if (obj instanceof Array) {
      return obj.join(' ') || undefined;
    } else {
      return Object.keys(obj).filter(function (key) {
        return obj[key];
      }).join(' ') || undefined;
    }
  } else {
    return obj;
  }
};
