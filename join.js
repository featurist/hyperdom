module.exports = function join (array, separator) {
  var output = []
  for (var i = 0, l = array.length; i < l; i++) {
    var item = array[i]
    if (i > 0) {
      output.push(separator)
    }
    output.push(item)
  }
  return output
}
