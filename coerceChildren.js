var vtext = require("virtual-dom/vnode/vtext.js")
var version = require("virtual-dom/vnode/version")

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
  var type = x.type;
  if (type == 'VirtualNode' || type == 'VirtualText') {
    return x.version == version;
  } else if (type == 'Widget' || type == 'Thunk') {
    return true;
  }
}
