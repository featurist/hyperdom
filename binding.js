var refreshify = require('./refreshify');
var meta = require('./meta');
var deprecations = require('./deprecations')

module.exports = function(b, options) {
  var binding = b

  if (b instanceof Array) {
    if (b.length > 2) {
      deprecations.mapBinding("[model, property, mapping] have moved to require('hyperdom/mapBinding')(model, property, mapping)")
    }
    binding = bindingObject.apply(undefined, b)
  }

  binding.set = refreshify(binding.set, options);

  return binding;
}

function bindingObject(model, property) {
  var _meta;

  return {
    get: function () {
      return model[property];
    },

    set: function (value) {
      model[property] = value;
    },

    meta: function() {
      return _meta || (_meta = meta(model, property));
    }
  };
}
