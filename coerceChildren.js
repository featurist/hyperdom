var vtext = require("virtual-dom/vnode/vtext.js")
var version = require("virtual-dom/vnode/version")
var rendering = require('./rendering');

function addChild(children, child) {
  if (child instanceof Array) {
    for (var n = 0; n < child.length; n++) {
      addChild(children, child[n]);
    }
  } else if (child === undefined || child === null) {
    // remove child
  } else {
    children.push(toVdom(child));
  }
}

module.exports = function (child) {
  var children = [];
  addChild(children, child);
  return children;
};

function toVdom(object) {
  if (typeof(object) != 'object') {
    return new vtext(String(object));
  } else if (object instanceof Date) {
    return new vtext(String(object));
  } else if (object instanceof Error) {
    return new vtext(object.toString());
  } else if (isChild(object)) {
    return object;
  } else if (typeof object.render === 'function') {
    return new rendering.ViewModel(object);
  } else {
    return new vtext(JSON.stringify(object));
  }
}

module.exports.toVdom = toVdom;

function isChild(x) {
  var type = x.type;
  if (type == 'VirtualNode' || type == 'VirtualText') {
    return x.version == version;
  } else if (type == 'Widget' || type == 'Thunk') {
    return true;
  }
}
