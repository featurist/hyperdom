try {
  module.exports = require('hyperx')(require('hyperdom').jsx)
}
catch(e) {
  if (e.code == 'MODULE_NOT_FOUND' && e.message.indexOf('hyperx') != -1) {
    throw new Error('to use hyperx with hyperdom you need to install the hyperx package')
  }
  throw e
}
