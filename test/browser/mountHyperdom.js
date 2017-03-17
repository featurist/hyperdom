var hyperdom = require('../..')
var browserMonkey = require('browser-monkey')
var extend = require('lowscore/extend')
var div

function createTestDiv() {
  if (div && div.parentNode) {
    div.parentNode.removeChild(div);
  }

  div = window.document.createElement('div')
  window.document.body.appendChild(div)

  return div;
}

module.exports = function (app, options) {
  var testDiv = createTestDiv()
  if (options && (options.hash || options.url) && options.router) {
    options.router.push(options.url || options.hash)
  }
  hyperdom.append(testDiv, app, extend({ requestRender: setTimeout }, options));
  return browserMonkey.scope(testDiv);
}
