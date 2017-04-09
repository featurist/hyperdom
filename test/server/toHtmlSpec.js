/* eslint-env mocha */

var toHtml = require('../../toHtml')
var hyperdom = require('../..')
var h = hyperdom.html
var expect = require('chai').expect

describe('to html', function () {
  it('can render regular virtual dom to HTML', function () {
    var vdom = h('div.class', {'data-something': 'something'},
      h('div', 'child')
    )

    expect(toHtml(vdom)).to.equal(
      '<div data-something="something" class="class"><div>child</div></div>'
    )
  })

  it('can render model components to HTML', function () {
    var vdom = h('div',
      {
        render: function () {
          return h('div', 'component')
        }
      }
    )
    expect(toHtml(vdom)).to.equal(
      '<div><div>component</div></div>'
    )
  })

  it('can render top-level model components to HTML', function () {
    var vdom = {
      render: function () {
        return h('div', 'component')
      }
    }

    expect(toHtml(vdom)).to.equal(
      '<div>component</div>'
    )
  })

  it('can render view components to HTML', function () {
    var vdom = h('div',
      hyperdom.component({
        render: function () {
          return h('div', 'component')
        }
      })
    )
    expect(toHtml(vdom)).to.equal(
      '<div><div>component</div></div>'
    )
  })

  it('can render top-level view components to HTML', function () {
    var vdom = hyperdom.component({
      render: function () {
        return h('div', 'component')
      }
    })

    expect(toHtml(vdom)).to.equal(
      '<div>component</div>'
    )
  })
})
