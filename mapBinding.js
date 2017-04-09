var bindingMeta = require('./meta')

function makeConverter (converter) {
  if (typeof converter === 'function') {
    return {
      view: function (model) {
        return model
      },
      model: function (view) {
        return converter(view)
      }
    }
  } else {
    return converter
  }
}

function chainConverters (startIndex, converters) {
  function makeConverters () {
    if (!_converters) {
      _converters = new Array(converters.length - startIndex)

      for (var n = startIndex; n < converters.length; n++) {
        _converters[n - startIndex] = makeConverter(converters[n])
      }
    }
  }

  if ((converters.length - startIndex) === 1) {
    return makeConverter(converters[startIndex])
  } else {
    var _converters
    return {
      view: function (model) {
        makeConverters()
        var intermediateValue = model
        for (var n = 0; n < _converters.length; n++) {
          intermediateValue = _converters[n].view(intermediateValue)
        }
        return intermediateValue
      },

      model: function (view) {
        makeConverters()
        var intermediateValue = view
        for (var n = _converters.length - 1; n >= 0; n--) {
          intermediateValue = _converters[n].model(intermediateValue)
        }
        return intermediateValue
      }
    }
  }
}

module.exports = function (model, property) {
  var _meta
  function hyperdomMeta () {
    return _meta || (_meta = bindingMeta(model, property))
  }

  var converter = chainConverters(2, arguments)

  return {
    get: function () {
      var meta = hyperdomMeta()
      var modelValue = model[property]
      var modelText

      if (meta.error) {
        return meta.view
      } else if (meta.view === undefined) {
        modelText = converter.view(modelValue)
        meta.view = modelText
        return modelText
      } else {
        var previousValue
        try {
          previousValue = converter.model(meta.view)
        } catch (e) {
          meta.error = e
          return meta.view
        }
        modelText = converter.view(modelValue)
        var normalisedPreviousText = converter.view(previousValue)

        if (modelText === normalisedPreviousText) {
          return meta.view
        } else {
          meta.view = modelText
          return modelText
        }
      }
    },

    set: function (view) {
      var meta = hyperdomMeta()
      meta.view = view

      try {
        model[property] = converter.model(view, model[property])
        delete meta.error
      } catch (e) {
        meta.error = e
      }
    },

    meta: function () {
      return hyperdomMeta()
    }
  }
}
