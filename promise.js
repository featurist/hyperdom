var rendering = require('./rendering');
var createElement = require('virtual-dom/create-element');
var coerceToVdom = require('./coerceToVdom');
var domComponent = require('./domComponent');

function PromiseWidget(promise, handlers) {
  this.promise = promise;
  this.handlers = handlers;
  this.refresh = rendering.globalRefresh;
  this.component = domComponent();
}

function runPromiseHandler(handlers, handler, value) {
  if (typeof handler == 'function') {
    return coerceToVdom(handler.call(handlers, value));
  } else if (handler === null || handler === undefined) {
    return coerceToVdom('');
  } else {
    return coerceToVdom(handler);
  }
}

PromiseWidget.prototype.type = 'Widget';

PromiseWidget.prototype.init = function () {
  var self = this;

  if (this.promise && typeof this.promise.then === 'function') {
    this.promise.then(function (value) {
      self.fulfilled = true;
      self.value = value;
      self.refresh();
    }, function (reason) {
      self.rejected = true;
      self.reason = reason;
      self.refresh();
    });

    return this.component.create(runPromiseHandler(this.handlers, this.handlers.pending));
  } else {
    self.fulfilled = true;
    self.value = this.promise;

    return this.component.create(runPromiseHandler(this.handlers, this.handlers.fulfilled, this.value));
  }
};

PromiseWidget.prototype.update = function (previous) {
  if (previous.promise === this.promise && (previous.rejected || previous.fulfilled)) {
    this.fulfilled = previous.fulfilled;
    this.value = previous.value;
    this.rejected = previous.rejected;
    this.reason = previous.reason;
    this.component = previous.component;
  } else {
    return this.init();
  }

  if (this.fulfilled) {
    return this.component.update(runPromiseHandler(this.handlers, this.handlers.fulfilled, this.value));
  } else if (this.rejected) {
    return this.component.update(runPromiseHandler(this.handlers, this.handlers.rejected, this.reason));
  }
};

PromiseWidget.prototype.destroy = function () {
  this.component.destroy();
};

module.exports = function(promise, handlers) {
  return new PromiseWidget(promise, handlers);
};
