var h = require('./vhtml');
var domComponent = require('./domComponent');
var simplePromise = require('./simplePromise');
var bindingMeta = require('./meta');
var toVdom = require('./toVdom');
var parseTag = require('virtual-dom/virtual-hyperscript/parse-tag');
var ViewModel = require('./viewModel');
var renderViewModel = require('./renderViewModel');

function doThenFireAfterRender(attachment, fn) {
  try {
    exports.html.currentRender = {attachment: attachment};
    exports.html.currentRender.finished = simplePromise();
    exports.html.refresh = function (component) {
      if (isComponent(component)) {
        refreshComponent(component, attachment);
      } else {
        attachment.refresh();
      }
    }

    fn();
  } finally {
    exports.html.currentRender.finished.fulfill();
    exports.html.currentRender.finished = undefined;
    delete exports.html.currentRender;
    exports.html.refresh = refreshOutOfRender;
  }
}

function refreshOutOfRender() {
  throw new Error('Please assign plastiq.html.refresh during a render cycle if you want to use it in event handlers. See https://github.com/featurist/plastiq#refresh-outside-render-cycle');
}

function areAllComponents(components) {
  for (var i = 0; i < components.length; i++) {
    if(!isComponent(components[i])) {
      return false;
    }
  }

  return true;
}

function isComponent(component) {
  return component
    && typeof component.init === 'function'
    && typeof component.update === 'function'
    && typeof component.destroy === 'function';
}

exports.merge = function (element, render, model, options) {
  var attachment = startAttachment(render, model, options, function(model, domComponentOptions) {
    var component = domComponent(domComponentOptions);
    exports.html.currentRender.eventHandlerWrapper = function() {
      return null;
    };
    var vdom = model.render();
    component.merge(vdom, element);
    return component;
  });

  attachment.refresh();

  return attachment;
};

exports.append = function (element, render, model, options) {
  return startAttachment(render, model, options, function(model, domComponentOptions) {
    var component = domComponent(domComponentOptions);
    var vdom = model.render();
    element.appendChild(component.create(vdom));
    return component;
  });
};

exports.replace = function (element, render, model, options) {
  return startAttachment(render, model, options, function(model, domComponentOptions) {
    var component = domComponent(domComponentOptions);
    var vdom = model.render();
    element.parentNode.replaceChild(component.create(vdom), element);
    return component;
  });
};

exports.appendVDom = function (vdom, render, model, options) {
  return startAttachment(render, model, options, function(model) {
    var component = {
      create: function(newVDom) {
        vdom.children = [];
        if (newVDom) {
          vdom.children.push(newVDom);
        }
      },
      update: function(newVDom) {
        vdom.children = [];
        if (newVDom) {
          vdom.children.push(newVDom);
        }
      }
    };
    component.create(model.render());
    return component;
  });
};

exports.ViewModel = ViewModel;

var attachmentId = 1;

function startAttachment(render, model, options, attachToDom) {
  if (typeof render == 'object' && typeof render.render == 'function') {
    return start(render, model, attachToDom);
  } else {
    return start({render: function () { return render(model); }}, options, attachToDom);
  }
}

function start(model, options, attachToDom) {
  var win = (options && options.window) || window;
  var requestRender = (options && options.requestRender) || win.requestAnimationFrame || win.setTimeout;
  var requested = false;

  function refresh() {
    if (!requested) {
      requestRender(function () {
        requested = false;

        if (attachment.attached) {
          doThenFireAfterRender(attachment, function () {
            var vdom = renderViewModel(model);
            component.update(vdom);
          });
        }
      });
      requested = true;
    }
  }

  var attachment = {
    refresh: refresh,
    requestRender: requestRender,
    id: attachmentId++,
    attached: true
  }

  var component;

  doThenFireAfterRender(attachment, function () {
    if (options) {
      var domComponentOptions = {document: options.document};
    }
    component = attachToDom(new ViewModel(model), domComponentOptions);
  });

  return {
    detach: function () {
      attachment.attached = false;
    },
    remove: function () {
      component.destroy({removeElement: true});
      attachment.attached = false;
    },
    refresh: refresh
  };
}

exports.attach = function () {
  console.warn('plastiq.attach has been renamed to plastiq.append, plastiq.attach will be deprecated in a future version');
  return exports.append.apply(this, arguments);
}

function refreshComponent(component, attachment) {
  if (!component.canRefresh) {
    throw new Error("this component cannot be refreshed, make sure that the component's view is returned from a function");
  }

  if (!component.requested) {
    var requestRender = attachment.requestRender;

    requestRender(function () {
      doThenFireAfterRender(attachment, function () {
        component.requested = false;
        component.refresh();
      });
    });
    component.requested = true;
  }
}

var norefresh = {};

function refreshify(fn, options) {
  if (!fn) {
    return fn;
  }

  if (!exports.html.currentRender) {
    if (typeof global === 'object') {
      return fn;
    } else {
      throw new Error('You cannot create virtual-dom event handlers outside a render function. See https://github.com/featurist/plastiq#outside-render-cycle');
    }
  }

  var onlyRefreshAfterPromise = options && options.refresh == 'promise';
  var componentToRefresh = options && options.component;

  if (options && (options.norefresh == true || options.refresh == false)) {
    return fn;
  }

  var attachment = exports.html.currentRender.attachment;
  var r = attachment.refresh;

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
        refreshComponent(result, attachment);
      } else if (result instanceof Array && areAllComponents(result)) {
        for (var i = 0; i < result.length; i++) {
          refreshComponent(result[i], attachment);
        }
      } else if (componentToRefresh) {
        refreshComponent(componentToRefresh, attachment);
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

function refreshAfter(promise) {
  var refresh = exports.html.refresh;

  promise.then(refresh);
}

function bindTextInput(attributes, children, get, set) {
  var textEventNames = ['onkeyup', 'oninput', 'onpaste', 'textInput'];

  var bindingValue = get();
  if (!(bindingValue instanceof Error)) {
    attributes.value = bindingValue != undefined? bindingValue: '';
  }

  attachEventHandler(attributes, textEventNames, function (ev) {
    if (bindingValue != ev.target.value) {
      set(ev.target.value);
    }
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
    for (var n = 0; n < eventNames.length; n++) {
      insertEventHandler(attributes, eventNames[n], handler);
    }
  } else {
    insertEventHandler(attributes, eventNames, handler);
  }
}

function ListenerHook(listener) {
  this.listener = exports.html.refreshify(listener);
}

ListenerHook.prototype.hook = function (element, propertyName) {
  element.addEventListener(propertyName.substring(2), this.listener, false);
};

ListenerHook.prototype.unhook = function (element, propertyName) {
  element.removeEventListener(propertyName.substring(2), this.listener);
};

function customEvent(name) {
  if (typeof Event == 'function') {
    return new Event(name);
  } else {
    var event = document.createEvent('Event');
    event.initEvent(name, false, false);
    return event;
  }
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
    attributes.on_plastiqsyncchecked = new ListenerHook(function (event) {
      attributes.checked = event.target.checked;
    });

    attachEventHandler(attributes, 'onclick', function (event) {
      var name = event.target.name;
      if (name) {
        var inputs = document.getElementsByName(name);
        for (var i = 0, l = inputs.length; i < l; i++) {
          inputs[i].dispatchEvent(customEvent('_plastiqsyncchecked'));
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

function bindModel(attributes, children, type) {
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

var renames = {
  for: 'htmlFor',
  class: 'className',
  contenteditable: 'contentEditable',
  tabindex: 'tabIndex',
  colspan: 'colSpan'
};

var dataAttributeRegex = /^data-/;

function prepareAttributes(tag, attributes, childElements) {
  var keys = Object.keys(attributes);
  var dataset;
  var eventHandlerWrapper = exports.html.currentRender && exports.html.currentRender.eventHandlerWrapper;

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

  if (attributes.className) {
    attributes.className = generateClassName(attributes.className);
  }

  if (attributes.binding) {
    bindModel(attributes, childElements, inputType(tag, attributes));
    delete attributes.binding;
  }
}

/**
 * this function is quite ugly and you may be very tempted
 * to refactor it into smaller functions, I certainly am.
 * however, it was written like this for performance
 * so think of that before refactoring! :)
 */
exports.html = function (hierarchySelector) {
  var hasHierarchy = hierarchySelector.indexOf(' ') >= 0;
  var selector, selectorElements;

  if (hasHierarchy) {
    selectorElements = hierarchySelector.match(/\S+/g);
    selector = selectorElements[selectorElements.length - 1];
  } else {
    selector = hierarchySelector;
  }

  var childElements;
  var vdom;
  var tag;
  var attributes = arguments[1];

  if (attributes && attributes.constructor == Object && typeof attributes.render !== 'function') {
    childElements = toVdom.recursive(Array.prototype.slice.call(arguments, 2));
    prepareAttributes(selector, attributes, childElements);
    tag = parseTag(selector, attributes);
    vdom = h(tag, attributes, childElements);
  } else {
    attributes = {};
    childElements = toVdom.recursive(Array.prototype.slice.call(arguments, 1));
    tag = parseTag(selector, attributes);
    vdom = h(tag, attributes, childElements);
  }

  if (hasHierarchy) {
    for(var n = selectorElements.length - 2; n >= 0; n--) {
      vdom = h(selectorElements[n], {}, [vdom]);
    }
  }

  return vdom;
};

exports.jsx = function (tag, attributes) {
  var childElements = toVdom.recursive(Array.prototype.slice.call(arguments, 2));
  if (attributes) {
    prepareAttributes(tag, attributes, childElements);
  }
  return h(tag, attributes || {}, childElements);
};

exports.html.refreshify = refreshify;
exports.html.refresh = refreshOutOfRender;
exports.html.refreshAfter = refreshAfter;
exports.html.norefresh = norefresh;

function makeBinding(b, options) {
  var binding = b instanceof Array
    ?  bindingObject.apply(undefined, b)
    : b;

  binding.set = refreshify(binding.set, options);

  return binding;
}

function makeConverter(converter) {
  if (typeof converter == 'function') {
    return {
      view: function (model) {
        return model;
      },
      model: function (view) {
        return converter(view);
      }
    };
  } else {
    return converter;
  }
}

function chainConverters(startIndex, converters) {
  function makeConverters() {
    if (!_converters) {
      _converters = new Array(converters.length - startIndex);

      for(var n = startIndex; n < converters.length; n++) {
        _converters[n - startIndex] = makeConverter(converters[n]);
      }
    }
  }

  if ((converters.length - startIndex) == 1) {
    return makeConverter(converters[startIndex]);
  } else {
    var _converters;
    return {
      view: function (model) {
        makeConverters();
        var intermediateValue = model;
        for(var n = 0; n < _converters.length; n++) {
          intermediateValue = _converters[n].view(intermediateValue);
        }
        return intermediateValue;
      },

      model: function (view) {
        makeConverters();
        var intermediateValue = view;
        for(var n = _converters.length - 1; n >= 0; n--) {
          intermediateValue = _converters[n].model(intermediateValue);
        }
        return intermediateValue;
      }
    };
  }
}

function bindingObject(model, property) {
  var _meta;
  function plastiqMeta() {
    return _meta || (_meta = bindingMeta(model, property));
  }

  if (arguments.length > 2) {
    var converter = chainConverters(2, arguments);

    return {
      get: function() {
        var meta = plastiqMeta();
        var modelValue = model[property];
        var modelText;

        if (meta.error) {
          return meta.view;
        } else if (meta.view === undefined) {
          modelText = converter.view(modelValue);
          meta.view = modelText;
          return modelText;
        } else {
          var previousValue = converter.model(meta.view);
          modelText = converter.view(modelValue);
          var normalisedPreviousText = converter.view(previousValue);

          if (modelText === normalisedPreviousText) {
            return meta.view;
          } else {
            meta.view = modelText;
            return modelText;
          }
        }
      },

      set: function(view) {
        var meta = plastiqMeta();
        meta.view = view;

        try {
          model[property] = converter.model(view, model[property]);
          delete meta.error;
        } catch (e) {
          meta.error = e;
        }
      },

      meta: function() {
        return plastiqMeta();
      }
    };
  } else {
    return {
      get: function () {
        return model[property];
      },

      set: function (value) {
        model[property] = value;
      },

      meta: function() {
        return plastiqMeta();
      }
    };
  }
}

exports.binding = makeBinding;
exports.html.binding = makeBinding;
exports.html.meta = bindingMeta;

function rawHtml() {
  var selector;
  var html;
  var options;

  if (arguments.length == 2) {
    selector = arguments[0];
    html = arguments[1];
    options = {innerHTML: html};
    return exports.html(selector, options);
  } else {
    selector = arguments[0];
    options = arguments[1];
    html = arguments[2];
    options.innerHTML = html;
    return exports.html(selector, options);
  }
}

exports.html.rawHtml = rawHtml;


function generateConditionalClassNames(obj) {
  return Object.keys(obj).filter(function (key) {
    return obj[key];
  }).join(' ') || undefined;
}

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
