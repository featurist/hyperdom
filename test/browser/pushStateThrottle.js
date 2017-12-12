var originalPushState = window.history.pushState
var browser = require('detect-browser')
var groupBy = require('lowscore/groupBy')
var sortBy = require('lowscore/sortBy')

function histogram (numbers, criteria) {
  var groups = groupBy(numbers, criteria)
  var cumulative = 0
  sortBy(Object.keys(groups)).forEach(function (key) {
    var count = groups[key].length
    cumulative += count
    console.warn(key + ': ' + count + ' (' + cumulative + ')')
  })
}

function createThrottle () {
  if (browser.name === 'safari' || browser.name === 'ios') {
    return new RollingThrottle({
      calls: 80,
      duration: 30000,
      name: 'history.pushState'
    })
  } else if (browser.name === 'chrome') {
    return new RollingThrottle({
      calls: 80,
      duration: 20000,
      name: 'history.pushState'
    })
  }
}

var throttle = createThrottle()

exports.start = function () {
  if (throttle) {
    return throttle.waitForAvailability(10).then(function () {
      window.history.pushState = function () {
        throttle.addCall()
        return originalPushState.apply(this, arguments)
      }
    })
  } else {
    return Promise.resolve()
  }
}

function RollingThrottle (options) {
  this.limit = options
  this.name = options.name
}

RollingThrottle.prototype.load = function () {
  var pushStateCalls = window.localStorage.pushStateCalls
  if (pushStateCalls) {
    try {
      return JSON.parse(pushStateCalls)
    } catch (e) {
      return []
    }
  }

  return []
}

RollingThrottle.prototype.waitForAvailability = function (callsRequired) {
  this.calls = this.load()
  var now = Date.now()
  var nthCall = this.calls[this.limit.calls - callsRequired]
  if (nthCall) {
    var timeOfNthCall = -(nthCall - now)
    var duration = this.limit.duration - timeOfNthCall
    if (duration > 0) {
      console.warn('there were ' + (this.limit.calls - callsRequired) + ' calls to ' + this.name + ' in the last ' + timeOfNthCall + 'ms, we have to wait ' + duration + 'ms to free up ' + callsRequired + ' calls for the next test')
      return wait(duration)
    }
  }

  return Promise.resolve()
}

RollingThrottle.prototype.addCall = function () {
  var now = Date.now()
  this.calls.unshift(now)
  console.warn('calls')
  histogram(this.calls.map(function (n) { return n - now }), function (n) { return Math.floor(n / 1000) })
}

RollingThrottle.prototype.save = function () {
  window.localStorage.pushStateCalls = JSON.stringify(this.calls)
}

exports.stop = function () {
  if (throttle) {
    window.history.pushState = originalPushState
    throttle.save()
  }

  return Promise.resolve()
}

function wait (n) {
  return new Promise(function (resolve) {
    setTimeout(resolve, n)
  })
}
