function deprecationWarning() {
  var warningIssued = false;

  return function () {
    if (!warningIssued) {
      console.warn.apply(console, arguments);
      warningIssued = true;
    }
  };
}

module.exports = {
  refresh: deprecationWarning(),
  currentRender: deprecationWarning(),
  window: deprecationWarning(),
  component: deprecationWarning(),
  renderFunction: deprecationWarning(),
  refreshAfter: deprecationWarning(),
  norefresh: deprecationWarning()
};
