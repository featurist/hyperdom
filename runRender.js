var plastiq = require('.');
var Render = require('./render');
var rendering = require('./rendering');

var currentRender;
var refresh;

function refreshOutOfRender() {
  throw new Error('Please assign plastiq.html.refresh during a render cycle if you want to use it in event handlers. See https://github.com/featurist/plastiq#refresh-outside-render-cycle');
}

module.exports = function(mount, fn) {
  var render = new Render(mount);

  try {
    plastiq._currentRender = render;

    rendering.html._currentRender = render;
    rendering.html._refresh = rendering.createEventResultHandler(mount);

    fn();
  } finally {
    render.finished.fulfill();
    plastiq._currentRender = undefined;

    rendering.html._refresh = refreshOutOfRender;
    rendering.html._currentRender = undefined;
  }
};
