function SimplePromise () {
  this.listeners = [];
}

SimplePromise.prototype.fulfill = function (value) {
  if (!this.isFulfilled) {
    this.isFulfilled = true;
    this.value = value;
    this.listeners.forEach(function (listener) {
      try {
        listener();
      } catch (e) {
      }
    });
  }
};

SimplePromise.prototype.then = function (success) {
  if (this.isFulfilled) {
    var self = this;
    setTimeout(function () {
      try {
        success(self.value);
      } catch (e) {
      }
    });
  } else {
    this.listeners.push(success);
  }
};

module.exports = function () {
  return new SimplePromise();
};
