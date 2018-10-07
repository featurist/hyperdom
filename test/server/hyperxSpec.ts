import hx = require('../../hyperx')
import toHtml = require('../../toHtml')
import {expect} from 'chai'

describe('hyperx', function() {
  it('can render with hyperx', function() {
    expect(toHtml(hx`<div>hi</div>`)).to.equal('<div>hi</div>')
  })
  it('can render svg with class with hyperx', function() {
    expect(toHtml(hx`<svg><rect class="hello"></rect></svg>`)).to.equal('<svg><rect class="hello"></rect></svg>')
  })
})
