var browser = require('detect-browser')

var version = Number(/^(\d+)/.exec(browser.version)[1])

module.exports = {
  pushState: !!window.history && !!window.history.pushState,
  historyBack: !(browser.name === 'ie' && version <= 9)
}
