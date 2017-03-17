var ViewModel = require('./viewModel')

module.exports = function (model, vdom) {
  return new ViewModel(model, {element: true})
}
