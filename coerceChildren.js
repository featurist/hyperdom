var vtext = require("virtual-dom/vnode/vtext.js")
var isVNode = require('virtual-dom/vnode/is-vnode');
var isVText = require('virtual-dom/vnode/is-vtext');
var isWidget = require('virtual-dom/vnode/is-widget');
var isVThunk = require('virtual-dom/vnode/is-thunk');

function addChild(children, child) {
  if (child instanceof Array) {
    for (var n = 0; n < child.length; n++) {
      addChild(children, child[n]);
    }
  } else if (child === undefined || child === null) {
    // remove child
  } else if (typeof(child) != 'object') {
    children.push(new vtext(String(child)));
  } else if (child instanceof Date) {
    children.push(new vtext(String(child)));
  } else if (child instanceof Error) {
    children.push(new vtext(child.toString()));
  } else if (isChild(child)) {
    children.push(child);
  } else {
    children.push(new vtext(JSON.stringify(child)));
  }
}

module.exports = function (child) {
  var children = [];
  addChild(children, child);
  return children;
};

function isChild(x) {
    return isVNode(x) || isVText(x) || isWidget(x) || isVThunk(x);
}
