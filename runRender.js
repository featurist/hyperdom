var hyperdom = require('.');
var Render = require('./render');
var rendering = require('./rendering');

function refreshOutOfRender() {
  throw new Error('Please assign hyperdom.html.refresh during a render cycle if you want to use it in event handlers. See https://github.com/featurist/hyperdom#refresh-outside-render-cycle');
}

module.exports = function(mount, fn) {
  var render = new Render(mount);

  try {
    hyperdom._currentRender = render;

    rendering.html._currentRender = render;
    rendering.html._refresh = rendering.createEventResultHandler(mount);

    fn();
  } finally {
    render.finished.fulfill();
    hyperdom._currentRender = undefined;

    rendering.html._refresh = refreshOutOfRender;
    rendering.html._currentRender = undefined;
  }
};
