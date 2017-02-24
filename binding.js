var refreshify = require('./refreshify');
var meta = require('./meta');

module.exports = function(b, options) {
  var binding = b

  if (b instanceof Array) {
    binding = bindingObject.apply(undefined, b)
  }

  binding.set = refreshify(binding.set, options);

  return binding;
}

function bindingObject(model, property, setter) {
  var _meta;

  return {
    get: function () {
      return model[property];
    },

    set: function (value) {
      model[property] = value;
      if (setter) {
        return setter(value)
      }
    },

    meta: function() {
      return _meta || (_meta = meta(model, property));
    }
  };
}
