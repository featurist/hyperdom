module.exports = function (model, property) {
  var hyperdomMeta = model._hyperdomMeta

  if (!hyperdomMeta) {
    hyperdomMeta = {}
    Object.defineProperty(model, '_hyperdomMeta', {value: hyperdomMeta})
  }

  if (property) {
    var meta = hyperdomMeta[property]

    if (!meta) {
      meta = hyperdomMeta[property] = {}
    }

    return meta
  } else {
    return hyperdomMeta
  }
}
