function deprecationWarning() {
  var warningIssued = false;

  return function (arg) {
    if (!warningIssued) {
      console.warn(arg);
      warningIssued = true;
    }
  };
}

module.exports = {
  refresh: deprecationWarning(),
  currentRender: deprecationWarning(),
  component: deprecationWarning(),
  renderFunction: deprecationWarning(),
  refreshAfter: deprecationWarning(),
  norefresh: deprecationWarning(),
  mapBinding: deprecationWarning()
};
