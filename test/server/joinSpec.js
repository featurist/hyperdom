/* eslint-env mocha */

var expect = require('chai').expect
var toHtml = require('../../toHtml')
var join = require('../../join')
var h = require('../..').html

describe('join', function () {
  it('can join an array of vdom by a separator', function () {
    expect(toHtml(h('div',
      join([
        h('code', 'one'),
        h('code', 'two'),
        h('code', 'three')
      ], ' ')
    ))).to.equal('<div><code>one</code> <code>two</code> <code>three</code></div>')
  })
})
