var plastiqMeta = require('./meta');

module.exports = function(model) {
  if (typeof model.renderCacheKey === 'function') {
    var meta = plastiqMeta(model);
    var key = model.renderCacheKey();
    if (key !== undefined && meta.cacheKey === key && meta.cachedVdom) {
      return meta.cachedVdom;
    } else {
      meta.cacheKey = key;
      return meta.cachedVdom = model.render();
    }
  } else {
    var vdom = model.render();
    if (vdom.properties) {
      vdom.properties._plastiqViewModel = model;
    }
    return vdom;
  }
};
