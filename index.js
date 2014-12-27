var h = require('virtual-dom/h');
var diff = require('virtual-dom/diff');
var patch = require('virtual-dom/patch');
var createElement = require('virtual-dom/create-element');

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

exports.attach = function (element, render, model) {
  function refresh() {
    var newTree = renderWithRefresh(render, model, refresh);
    var patches = diff(tree, newTree);
    rootNode = patch(rootNode, patches);
    tree = newTree;
  }

  var tree = renderWithRefresh(render, model, refresh);
  var rootNode = createElement(tree);
  element.appendChild(rootNode);
};

exports.bind = function (obj, prop) {
  return function (arg) {
    if (arg === undefined) {
      return obj[prop];
    } else {
      obj[prop] = arg;
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

  listenToEvents(attributes, textEventNames, function (ev) {
    set(ev.target.value);
  });
}

function listenToEvents(attributes, eventNames, handler) {
  if (eventNames instanceof Array) {
    eventNames.forEach(function (eventName) {
      attributes[eventName] = handler;
    });
  } else {
    attributes[eventNames] = handler;
  }
}

function bindValue(attributes, children, type) {
  var inputTypeBindings = {
    text: bindTextInput,
    textarea: bindTextInput,
    checkbox: function (attributes, children, get, set) {
      attributes.checked = get();

      listenToEvents(attributes, 'onclick', function (ev) {
        set(ev.target.checked);
      });
    },
    radio: function (attributes, children, get, set) {
      var value = attributes.value;
      attributes.checked = get() == attributes.value;

      attributes.onclick = function (ev) {
        set(value);
      };
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

      attributes.onchange = function (ev) {
        set(values[ev.target.value]);
      };
    }
  };

  var binding = inputTypeBindings[type] || bindTextInput;

  binding(attributes, children, attributes.model, refreshFunction(attributes.model));
}

function inputType(selector, properties) {
  if (/^textarea\b/i.test(selector)) {
    return 'textarea';
  } else if (/^select\b/i.test(selector)) {
    return 'select';
  } else {
    return properties.type || 'text';
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

function normaliseChildren(children) {
  return children.map(function (child) {
    if (child === undefined || child == null) {
      return undefined;
    } else if (typeof(child) != 'object') {
      return String(child);
    } else if (child instanceof Date) {
      return String(child);
    } else {
      return child;
    }
  });
}

exports.html = function (selector) {
  var properties;
  var childElements;

  if (arguments[1] && arguments[1].constructor == Object) {
    properties = arguments[1];
    childElements = normaliseChildren(flatten(Array.prototype.slice.call(arguments, 2)));

    Object.keys(properties).forEach(function (key) {
      if (typeof(properties[key]) == 'function') {
        if (key == 'model') {
          bindValue(properties, childElements, inputType(selector, properties));
        } else {
          properties[key] = refreshFunction(properties[key]);
        }
      }
    });

    return h.call(undefined, selector, properties, childElements);
  } else {
    childElements = normaliseChildren(flatten(Array.prototype.slice.call(arguments, 1)));
    return h.call(undefined, selector, childElements);
  }
};
