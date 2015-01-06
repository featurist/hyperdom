var h = require('virtual-dom/h');
var diff = require('virtual-dom/diff');
var patch = require('virtual-dom/patch');
var createElement = require('virtual-dom/create-element');
var vtext = require('virtual-dom/vnode/vtext');

var globalRefresh;

function renderWithRefresh(render, model, refresh) {
  var tree;

  try {
    globalRefresh = refresh;
    tree = render(model);
  } finally {
    globalRefresh = undefined;
  }

  return tree;
}

exports.attach = function (element, render, model, options) {
  var requestRender = (options && options.requestRender) || window.requestAnimationFrame || setTimeout;
  var requested = false;

  function refresh() {
    if (!requested) {
      requestRender(function () {
        requested = false;

        var newTree = renderWithRefresh(render, model, refresh);
        var patches = diff(tree, newTree);
        rootNode = patch(rootNode, patches);
        tree = newTree;
      });
      requested = true;
    }
  }

  var tree = renderWithRefresh(render, model, refresh);
  var rootNode = createElement(tree);
  element.appendChild(rootNode);
};

exports.bind = function (obj, prop) {
  return {
    get: function () {
      return obj[prop];
    },
    set: function (value) {
      obj[prop] = value;
    }
  };
};

function refreshFunction(fn) {
  var r = globalRefresh;

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
    bindingAttr = exports.bind(bindingAttr[0], bindingAttr[1]);
  }
  binding(attributes, children, bindingAttr.get, refreshFunction(bindingAttr.set));
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

function normaliseChild(child) {
  if (child === undefined || child == null) {
    return undefined;
  } else if (typeof(child) != 'object') {
    return String(child);
  } else if (child instanceof Date) {
    return String(child);
  } else {
    return child;
  }
}

function normaliseChildren(children) {
  return children.map(normaliseChild);
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
    childElements = normaliseChildren(flatten(Array.prototype.slice.call(arguments, 2)));

    Object.keys(attributes).forEach(function (key) {
      if (typeof(attributes[key]) == 'function') {
        attributes[key] = refreshFunction(attributes[key]);
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
    childElements = normaliseChildren(flatten(Array.prototype.slice.call(arguments, 1)));
    return h.call(undefined, selector, childElements);
  }
};

function RawHtmlWidget(selector, options, html) {
  this.selector = selector;
  this.options = options;
  this.html = html;
}

RawHtmlWidget.prototype.type = 'Widget';

RawHtmlWidget.prototype.init = function () {
  var element = createElement(exports.html(this.selector, this.options));
  element.innerHTML = this.html;
  return element;
};

RawHtmlWidget.prototype.update = function (previous, element) {
  element.parentNode.replaceChild(this.init(), element);
};

RawHtmlWidget.prototype.destroy = function (element) {
};

function normalise(a) {
  var normalised = normaliseChild(a);

  if (typeof normalised == 'string') {
    return new vtext(normalised);
  } else {
    return normalised;
  }
}

exports.html.rawHtml = function (selector, options, html) {
  if (arguments.length == 2) {
    return new RawHtmlWidget(selector, undefined, options);
  } else {
    return new RawHtmlWidget(selector, options, html);
  }
};

function PromiseWidget(promise, handlers) {
  this.promise = promise;
  this.handlers = handlers;
  this.refresh = globalRefresh;
}

function runPromiseHandler(handlers, handler, value) {
  if (typeof handler == 'function') {
    return createElement(normalise(handler.call(handlers, value)));
  } else if (handler === null || handler === undefined) {
    return document.createTextNode('');
  } else {
    return createElement(normalise(handler));
  }
}

PromiseWidget.prototype.type = 'Widget';

PromiseWidget.prototype.init = function () {
  var self = this;

  this.promise.then(function (value) {
    self.fulfilled = true;
    self.value = value;
    self.refresh();
  }, function (reason) {
    self.rejected = true;
    self.reason = reason;
    self.refresh();
  });

  return runPromiseHandler(this.handlers, this.handlers.pending);
};

PromiseWidget.prototype.update = function (previous) {
  if (previous.promise === this.promise && (previous.rejected || previous.fulfilled)) {
    this.fulfilled = previous.fulfilled;
    this.value = previous.value;
    this.rejected = previous.rejected;
    this.reason = previous.reason;
  } else {
    return this.init();
  }

  if (this.fulfilled) {
    return runPromiseHandler(this.handlers, this.handlers.fulfilled, this.value);
  } else if (this.rejected) {
    return runPromiseHandler(this.handlers, this.handlers.rejected, this.reason);
  }
};

exports.html.promise = function(promise, handlers) {
  return new PromiseWidget(promise, handlers);
};

function AnimationWidget(fn) {
  this.fn = fn;
  this.refresh = globalRefresh;
}

AnimationWidget.prototype.type = 'Widget';

AnimationWidget.prototype.init = function () {
  this.fn(this.refresh);
  return document.createTextNode('');
};

AnimationWidget.prototype.update = function () {
};

AnimationWidget.prototype.destroy = function () {
};

exports.html.animation = function (fn) {
  return new AnimationWidget(fn);
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
