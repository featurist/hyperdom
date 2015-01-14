module.exports = function (obj, prop) {
  console.log("plastiq.bind() will be deprecated in the next release, use [model, 'fieldName'] instead");

  return {
    get: function () {
      return obj[prop];
    },
    set: function (value) {
      obj[prop] = value;
    }
  };
};
