var plastiq = require('.');
var h = plastiq.html;

module.exports = function (value, options, fn) {
  if (typeof options === 'function') {
    fn = options;
    options = undefined;
  }

  var refresh = h.refresh;
  var throttle = options && options.hasOwnProperty('throttle') && options.throttle !== undefined? options.throttle: 300;

  return h.component(
    {
      fn: fn,
      value: value,

      onadd: function () {
        this.sync();
      },

      callFn: function () {
        var self = this;

        if (this.promise) {
          if (!this.awaitingPromise) {
            this.promise.then(function () {
              delete self.promise;
              delete self.awaitingPromise;
              self.sync();
            });

            this.awaitingPromise = true;
          }
        } else {
          var result = this.fn(this.value);
          if (result && typeof result.then === 'function') {
            this.promise = result;
            this.promise.then(refresh);
          }
          this.lastValue = this.value;
          this.lastTime = Date.now();
        }
      },

      sync: function () {
        var self = this;
        var now = Date.now();

        if (this.lastValue != this.value) {
          if (!this.lastTime || (this.lastTime + throttle < now)) {
            this.callFn();
          } else if (!this.timeout) {
            var timeoutDuration = this.lastTime - now + throttle;
            this.timeout = setTimeout(function () {
              delete self.timeout;
              self.callFn();
            }, timeoutDuration);
          }
        }
      },

      onupdate: function () {
        this.sync();
      }
    },
    ''
  );
};
