module.exports = function(binding) {
  if (binding instanceof Array) {
    return bind(binding[0], binding[1]);
  } else {
    return binding;
  }
};

function bind(obj, prop) {
  return {
    get: function () {
      return obj[prop];
    },
    set: function (value) {
      obj[prop] = value;
    }
  };
};
