module.exports = function (model, property) {
  var plastiqMeta = model._plastiqMeta;

  if (!plastiqMeta) {
    plastiqMeta = {};
    Object.defineProperty(model, '_plastiqMeta', {value: plastiqMeta});
  }

  if (property) {
    var meta = plastiqMeta[property];

    if (!meta) {
      meta = plastiqMeta[property] = {};
    }

    return meta;
  } else {
    return plastiqMeta;
  }
};
