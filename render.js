var simplePromise = require('./simplePromise');

function Render(mount) {
  this.finished = simplePromise();
  this.mount = mount;
  this.attachment = mount;
}

module.exports = Render;
