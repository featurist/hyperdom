var meta = require('./meta')

module.exports = function (b) {
  var binding = b

  if (b instanceof Array) {
    binding = bindingObject.apply(undefined, b)
  } else if (b instanceof Object && (typeof b.set === 'function' || typeof b.get === 'function')) {
    binding = b
  } else {
    throw Error('hyperdom bindings must be either an array [object, property, setter] or an object { get(), set(value) }, instead binding was: ' + JSON.stringify(b))
  }

  return binding
}

function bindingObject (model, property, setter) {
  var _meta

  return {
    get: function () {
      return model[property]
    },

    set: function (value) {
      model[property] = value
      if (setter) {
        return setter(value)
      }
    },

    meta: function () {
      return _meta || (_meta = meta(model, property))
    }
  }
}
