var rendering = require('./rendering');

module.exports = function (render, model) {
  var r = typeof render == 'object' && typeof render.render == 'function'
    ? function () { return render.render(); }
    : function () { return render(model); }

  exports.html.currentRender.eventHandlerWrapper = function() {
    return 'handleWhenPlastiqIsReady';
  };


  var attachment = startAttachment(render, model, options, function(render) {
    var component = domComponent();
    exports.html.currentRender.eventHandlerWrapper = function() {
      return null;
    };
    var vdom = render();
    component.merge(vdom, element);
    return component;
  });

  attachment.refresh();

  return attachment;
};
