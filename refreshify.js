var render = require('./render');

module.exports = function(fn, options) {
  return render.currentRender().mount.refreshify(fn, options)
}
