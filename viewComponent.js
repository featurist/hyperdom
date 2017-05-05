var Component = require('./component')

module.exports = function (model) {
  return new Component(model, {viewComponent: true})
}
