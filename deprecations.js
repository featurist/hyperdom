function deprecationWarning () {
  var warningIssued = false

  return function (arg) {
    if (process.env.NODE_ENV !== 'production' && !warningIssued) {
      console.warn(arg) // eslint-disable-line no-console
      warningIssued = true
    }
  }
}

module.exports = {
  refresh: deprecationWarning(),
  currentRender: deprecationWarning(),
  component: deprecationWarning(),
  renderFunction: deprecationWarning(),
  norefresh: deprecationWarning(),
  mapBinding: deprecationWarning(),
  viewComponent: deprecationWarning(),
  htmlRawHtml: deprecationWarning(),
  htmlBinding: deprecationWarning(),
  refreshAfter: deprecationWarning()
}
