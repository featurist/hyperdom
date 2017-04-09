/* eslint-env mocha */

var hx = require('../../hyperx')
var toHtml = require('../../toHtml')
var expect = require('chai').expect

describe('hyperx', function () {
  it('can render with hyperx', function () {
    expect(toHtml(hx`<div>hi</div>`)).to.equal('<div>hi</div>')
  })
})
