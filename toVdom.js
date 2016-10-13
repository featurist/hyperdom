var vtext = require("virtual-dom/vnode/vtext.js")
var rendering = require('./rendering');
var isVdom = require('./isVdom');

function toVdom(object) {
  if (object === undefined || object === null) {
    return new vtext('');
  } else if (typeof(object) != 'object') {
    return new vtext(String(object));
  } else if (object instanceof Date) {
    return new vtext(String(object));
  } else if (object instanceof Error) {
    return new vtext(object.toString());
  } else if (isVdom(object)) {
    return object;
  } else if (typeof object.render === 'function') {
    return new rendering.ViewModel(object);
  } else {
    return new vtext(JSON.stringify(object));
  }
}

module.exports = toVdom;

function addChild(children, child) {
  if (child instanceof Array) {
    for (var n = 0; n < child.length; n++) {
      addChild(children, child[n]);
    }
  } else {
    children.push(toVdom(child));
  }
}

module.exports.recursive = function (child) {
  var children = [];
  addChild(children, child);
  return children;
};
