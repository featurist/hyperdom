var domComponent = require('./domComponent');
var Mount = require('./mount')
var vdomParser = require('vdom-parser')
var render = require('./render');

module.exports = function(div, app, options) {
  var mount = new Mount(app, options);
  mount.component = domComponent.create(options);
  var serverVdom = vdomParser(div)
  mount.component.merge(serverVdom, div);

  var vdom = render(mount, function () {
    return mount.render();
  })
  mount.component.update(vdom);

  return mount
}
