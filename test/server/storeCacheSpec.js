/* eslint-env mocha */

var serverRenderCache = require('../../serverRenderCache')
var StoreCache = require('../../storeCache')
var render = require('../../render')
var expect = require('chai').expect
var refreshify = require('../../render').refreshify

describe('store cache', function () {
  var storeCache
  var oldCurrentRender

  beforeEach(function () {
    storeCache = new StoreCache()

    oldCurrentRender = render._currentRender
    render._currentRender = {
      mount: {
        refreshify: storeCache.refreshify,
        serverRenderCache: storeCache
      }
    }
  })

  afterEach(function () {
    render._currentRender = oldCurrentRender
  })

  function load (data) {
    return wait(10).then(() => data)
  }

  function wait (n) {
    return new Promise((resolve) => {
      setTimeout(resolve, 10)
    })
  }

  it('can store data loaded', function () {
    var setData1
    var setData2

    refreshify(function () {
      return serverRenderCache('key', () => load('some data')).then(data => {
        expect(data).to.equal('some data')
        return (setData1 = data)
      }).then(data => {
        return (setData2 = data)
      })
    })()

    return storeCache.loaded().then(() => {
      expect(storeCache.data).to.eql({
        key: 'some data'
      })
      expect(setData1).to.equal('some data')
      expect(setData2).to.equal('some data')
    })
  })

  it("can store data even if promise isn't returned", function () {
    var setData

    refreshify(function () {
      serverRenderCache('key', () => load('some data')).then(data => {
        expect(data).to.equal('some data')
        setData = data
      })
    })()

    return storeCache.loaded().then(() => {
      expect(storeCache.data).to.eql({key: 'some data'})
      expect(setData).to.equal('some data')
    })
  })
})
