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

function propertyForInputType(type) {
  return {
    checkbox: 'checked'
  }[type] || 'value';
}

function eventNamesForInputType(type) {
  var textEventNames = ['onkeydown', 'oninput', 'onpaste', 'textInput'];

  return {
    text: textEventNames,
    textarea: textEventNames,
    checkbox: ['onclick']
  }[type] || ['onchange'];
}

function bindValue(properties, type) {
  var property = propertyForInputType(type);

  var binding = properties.model;
  var refreshBinding = refreshFunction(binding);
  properties[property] = binding();

  var eventNames = eventNamesForInputType(type);

  eventNames.forEach(function (eventName) {
    properties[eventName] = function (ev) {
      refreshBinding(ev.target[property]);
    };
  });
}

function inputType(selector, properties) {
  if (/^textarea\b/i.test(selector)) {
    return 'textarea';
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

exports.html = function (selector) {
  var properties;
  var childElements;

  if (arguments[1] && arguments[1].constructor == Object) {
    properties = arguments[1];

    Object.keys(properties).forEach(function (key) {
      if (typeof(properties[key]) == 'function') {
        if (key == 'model') {
          bindValue(properties, inputType(selector, properties));
        } else {
          properties[key] = refreshFunction(properties[key]);
        }
      }
    });

    childElements = flatten(Array.prototype.slice.call(arguments, 2));
    return h.call(undefined, selector, properties, childElements);
  } else {
    childElements = flatten(Array.prototype.slice.call(arguments, 1));
    return h.call(undefined, selector, childElements);
  }
};

exports.html.animation = function (fn) {
  var handlers = [];

  function render() {
    handlers.forEach(function (handler) {
      handler();
    });
  }

  fn(render);

  return {
    then: function (s) {
      handlers.push(s);
    }
  };
};
