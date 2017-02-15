var loadCache = require('../../loadCache')
var StoreCache = require('../../storeCache')
var render = require('../../render')
var expect = require('chai').expect
var refreshify = require('../../refreshify')

describe('store cache', function () {
  var storeCache

  beforeEach(function () {
    storeCache = new StoreCache()

    render._currentRender = {
      mount: {
        refreshify: StoreCache.refreshify,
        loadCache: storeCache
      }
    }
  })

  function load(data) {
    return wait(10).then(() => data)
  }

  function wait(n) {
    return new Promise((resolve) => {
      setTimeout(resolve, 10)
    });
  }

  it('can store data loaded', function () {
    var setData1
    var setData2

    refreshify(function () {
      return loadCache('key', () => load('some data')).then(data => {
        expect(data).to.equal('some data')
        return setData1 = data
      }).then(data => {
        return setData2 = data
      })
    })()

    return storeCache.loaded().then(() => {
      expect(storeCache.data).to.eql({
        key: 'some data'
      })
      expect(setData1).to.equal('some data')
      expect(setData2).to.equal('some data')
    })
  });

  it("doesn't store value in model in time if promise not returned", function () {
    var setData

    refreshify(function () {
      loadCache('key', () => load('some data')).then(data => {
        expect(data).to.equal('some data')
        setData = data
      })
    })()

    return storeCache.loaded().then(() => {
      expect(storeCache.data).to.eql({})
      expect(setData).to.be.undefined
    })
  });
});
