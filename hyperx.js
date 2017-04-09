try {
  var hyperx = require('hyperx')
} catch (e) {
  if (e.code === 'MODULE_NOT_FOUND') {
    throw new Error('to use hyperx with hyperdom you need to install the hyperx package')
  }
  throw e
}

module.exports = hyperx(require('./rendering').jsx)
