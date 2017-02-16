var hyperdom = require('.');
var deprecations = require('./deprecations');

var norefresh = {};

function norefreshFunction() {
  return norefresh;
}

module.exports = function(fn, options) {
  if (!fn) {
    return fn;
  }

  if (options && (options.norefresh == true || options.refresh == false)) {
    return fn;
  }

  var mount = currentMount()

  return function () {
    var result = fn.apply(this, arguments);
    return refreshAfterEvent(result, mount, options);
  };
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

var noMount = {
  rerenderWidget: function() {
    this.rerender()
  },

  rerender: function() {
    throw new Error('You cannot create virtual-dom event handlers outside a render function. See https://github.com/featurist/hyperdom#outside-render-cycle');
  }
}

function currentMount() {
  var currentRender = hyperdom.currentRender();

  return currentRender? currentRender.mount: noMount
}

module.exports.norefresh = norefreshFunction
module.exports.refreshAfterEvent = refreshAfterEvent

function refreshAfterEvent(result, mount, options) {
  if (!mount) {
    mount = currentMount()
  }
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
