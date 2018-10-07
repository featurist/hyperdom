import {expect} from 'chai'
import {html as h} from '../..'
import join = require('../../join')
import toHtml = require('../../toHtml')

describe('join', function() {
  it('can join an array of vdom by a separator', function() {
    expect(toHtml(h('div',
      join([
        h('code', 'one'),
        h('code', 'two'),
        h('code', 'three'),
      ], ' '),
    ))).to.equal('<div><code>one</code> <code>two</code> <code>three</code></div>')
  })
})
