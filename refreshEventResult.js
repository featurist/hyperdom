var deprecations = require('./deprecations');

module.exports = refreshAfterEvent

var norefresh = {};

function norefreshFunction() {
  return norefresh;
}

module.exports.norefresh = norefreshFunction

function refreshAfterEvent(result, mount, options) {
  var onlyRefreshAfterPromise = options && options.refresh == 'promise';
  var viewModelToRefresh = options && options.viewModel;
  var componentToRefresh = options && options.component;

  if (result && typeof(result.then) == 'function') {
    result.then(function (result) {
      var opts = cloneOptions(options)
      opts.refresh = undefined
      refreshAfterEvent(result, mount, opts);
    });
  }

  if (onlyRefreshAfterPromise) {
    return;
  }

  if (isViewModelOrComponent(result)) {
    mount.rerenderWidget(result);
  } else if (result instanceof Array) {
    for (var i = 0; i < result.length; i++) {
      refreshAfterEvent(result[i], mount, options);
    }
  } else if (viewModelToRefresh) {
    viewModelToRefresh.rerenderViewModel();
  } else if (componentToRefresh) {
    componentToRefresh.refresh();
  } else if (result === norefresh) {
    // don't refresh;
  } else if (result === norefreshFunction) {
    deprecations.norefresh('hyperdom.norefresh is deprecated, please use hyperdom.norefresh()');
    // don't refresh;
  } else {
    mount.rerender();
    return result;
  }
}

function isViewModelOrComponent(component) {
  return component
    && ((typeof component.init === 'function'
       && typeof component.update === 'function'
       && typeof component.destroy === 'function') || (typeof component.renderViewModel === 'function'));
}

function cloneOptions(options) {
  if (options) {
    return {
      norefresh: options.norefresh,
      refresh: options.refresh,
      viewModel: options.viewModel,
      component: options.component,
    }
  } else {
    return {}
  }
}
