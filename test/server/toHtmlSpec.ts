import * as hyperdom from '../..'
import toHtml = require('../../toHtml')
const h = hyperdom.html
import {expect} from 'chai'

describe('to html', function () {
  it('can render regular virtual dom to HTML', function () {
    const vdom = h('div.class', {'data-something': 'something'},
      h('div', 'child'),
    )

    expect(toHtml(vdom)).to.equal(
      '<div data-something="something" class="class"><div>child</div></div>',
    )
  })

  it('can render model components to HTML', function () {
    const vdom = h('div',
      {
        render () {
          return h('div', 'component')
        },
      },
    )
    expect(toHtml(vdom)).to.equal(
      '<div><div>component</div></div>',
    )
  })

  it('can render top-level model components to HTML', function () {
    const vdom = {
      render () {
        return h('div', 'component')
      },
    }

    expect(toHtml(vdom)).to.equal(
      '<div>component</div>',
    )
  })

  it('can render view components to HTML', function () {
    const vdom = h('div',
      hyperdom.viewComponent({
        render () {
          return h('div', 'component')
        },
      }),
    )
    expect(toHtml(vdom)).to.equal(
      '<div><div>component</div></div>',
    )
  })

  it('can render top-level view components to HTML', function () {
    const vdom = hyperdom.viewComponent({
      render () {
        return h('div', 'component')
      },
    })

    expect(toHtml(vdom)).to.equal(
      '<div>component</div>',
    )
  })
})
