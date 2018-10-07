import serverRenderCache = require('../../serverRenderCache')
import StoreCache = require('../../storeCache')
import {expect} from 'chai'
import render = require('../../render')
const refreshify = render.refreshify

describe('store cache', function() {
  let storeCache: any
  let oldCurrentRender: any

  beforeEach(function() {
    storeCache = new StoreCache()

    oldCurrentRender = render._currentRender
    render._currentRender = {
      mount: {
        refreshify: storeCache.refreshify,
        serverRenderCache: storeCache,
      },
    }
  })

  afterEach(function() {
    render._currentRender = oldCurrentRender
  })

  function load(data: string) {
    return wait(10).then(function() { return data })
  }

  function wait(n: number) {
    return new Promise(function(resolve) {
      setTimeout(resolve, n)
    })
  }

  it('can store data loaded', function() {
    let setData1: string
    let setData2: string

    refreshify(function() {
      return serverRenderCache('key', function() { return load('some data') }).then(function(data: string) {
        expect(data).to.equal('some data')
        return (setData1 = data)
      }).then(function(data: string) {
        return (setData2 = data)
      })
    })()

    return storeCache.loaded().then(function() {
      expect(storeCache.data).to.eql({
        key: 'some data',
      })
      expect(setData1).to.equal('some data')
      expect(setData2).to.equal('some data')
    })
  })

  it("can store data even if promise isn't returned", function() {
    let setData: string

    refreshify(function() {
      serverRenderCache('key', function() { return load('some data') }).then(function(data: string) {
        expect(data).to.equal('some data')
        setData = data
      })
    })()

    return storeCache.loaded().then(function() {
      expect(storeCache.data).to.eql({key: 'some data'})
      expect(setData).to.equal('some data')
    })
  })
})
