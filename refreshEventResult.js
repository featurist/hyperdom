var deprecations = require('./deprecations')

module.exports = refreshEventResult

var norefresh = {}

function norefreshFunction () {
  return norefresh
}

module.exports.norefresh = norefreshFunction

function refreshEventResult (result, mount, options) {
  var onlyRefreshAfterPromise = options && options.refresh === 'promise'
  var componentToRefresh = options && options.component

  if (result && typeof (result.then) === 'function') {
    result.then(function (result) {
      var opts = cloneOptions(options)
      opts.refresh = undefined
      refreshEventResult(result, mount, opts)
    })
  }

  if (onlyRefreshAfterPromise) {
    return
  }

  if (isComponent(result)) {
    mount.refreshComponent(result)
  } else if (result instanceof Array) {
    for (var i = 0; i < result.length; i++) {
      refreshEventResult(result[i], mount, options)
    }
  } else if (componentToRefresh) {
    if (componentToRefresh.refreshComponent) {
      componentToRefresh.refreshComponent()
    } else {
      componentToRefresh.refresh()
    }
  } else if (result === norefresh) {
    // don't refresh;
  } else if (result === norefreshFunction) {
    deprecations.norefresh('hyperdom.norefresh is deprecated, please use hyperdom.norefresh()')
    // don't refresh;
  } else {
    mount.refresh()
    return result
  }
}

function isComponent (component) {
  return component &&
    ((typeof component.init === 'function' &&
       typeof component.update === 'function' &&
       typeof component.destroy === 'function') || (typeof component.refreshComponent === 'function'))
}

function cloneOptions (options) {
  if (options) {
    return {
      norefresh: options.norefresh,
      refresh: options.refresh,
      component: options.component
    }
  } else {
    return {}
  }
}
