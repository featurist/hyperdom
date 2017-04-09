var hyperdom = require('../..')
var browserMonkey = require('browser-monkey')
var extend = require('lowscore/extend')
var div

function createTestDiv () {
  if (div && div.parentNode) {
    div.parentNode.removeChild(div)
  }

  div = window.document.createElement('div')
  window.document.body.appendChild(div)

  return div
}

function createReloadButton (href) {
  var link = document.createElement('a')
  link.href = href
  link.innerText = '⟳ reload'
  link.style = 'z-index: 1000;' +
    'position: fixed;' +
    'right: 5px;' +
    'bottom: 5px;'

  return link
}

window.addEventListener('onload', function () {
  document.body.append(createReloadButton(window.location.href))
})

module.exports = function (app, options) {
  var testDiv = createTestDiv()
  if (options && (options.hash || options.url) && options.router) {
    options.router.push(options.url || options.hash)
  }
  hyperdom.append(testDiv, app, extend({ requestRender: setTimeout }, options))
  return browserMonkey.scope(testDiv)
}
