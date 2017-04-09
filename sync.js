var hyperdom = require('.')
var h = hyperdom.html

module.exports = function () {
  var refresh
  var throttle

  var promise, awaitingPromise, lastTime, lastValue, timeout

  var currentValue
  var currentFn

  function callFn () {
    if (promise) {
      if (!awaitingPromise) {
        promise.then(function () {
          promise = undefined
          awaitingPromise = undefined
          sync()
        })

        awaitingPromise = true
      }
    } else {
      var result = currentFn(currentValue)
      if (result && typeof result.then === 'function') {
        promise = result
        promise.then(refresh)
      }
      valueChanged()
      lastTime = Date.now()
    }
  }

  function valueHasChanged () {
    return lastValue !== normalisedValue(currentValue)
  }

  function valueChanged () {
    lastValue = normalisedValue(currentValue)
  }

  function sync () {
    var now = Date.now()

    if (valueHasChanged()) {
      if (!lastTime || (lastTime + throttle < now)) {
        callFn()
      } else if (!timeout) {
        var timeoutDuration = lastTime - now + throttle
        timeout = setTimeout(function () {
          timeout = undefined
          callFn()
        }, timeoutDuration)
      }
    }
  }

  return function (value, options, fn) {
    if (typeof options === 'function') {
      fn = options
      options = undefined
    }

    refresh = h.refresh
    throttle = options && options.hasOwnProperty('throttle') && options.throttle !== undefined ? options.throttle : 0

    currentValue = value
    currentFn = fn

    sync()
  }
}

function normalisedValue (value) {
  return value.constructor === Object || value instanceof Array
    ? JSON.stringify(value)
    : value
}
