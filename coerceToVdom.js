var vtext = require("virtual-dom/vnode/vtext.js")

module.exports = function (child) {
  if (child === undefined || child == null) {
    return undefined;
  } else if (typeof(child) != 'object') {
    return new vtext(String(child));
  } else if (child instanceof Date) {
    return new vtext(String(child));
  } else {
    return child;
  }
};
