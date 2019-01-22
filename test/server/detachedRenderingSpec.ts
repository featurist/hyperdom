import * as hyperdom from '../..'
const h = hyperdom.html

import * as vdomToHtml from 'vdom-to-html'
import {expect} from 'chai'
import hyperdomComponent = require('../../componentWidget')

describe('hyperdom', function () {
  describe('.html(), detached from a real DOM', function () {
    it('creates a virtual dom with event handlers', function () {
      const model = { counter: 0 }
      const vdom = h('.outer',
        h('.inner', {
          onclick () {
            model.counter++
          },
        }),
        hyperdomComponent(function () {
          return h('.component')
        }),
        h.rawHtml('div', '<span>some raw HTML</span>'),
      )
      const html = vdomToHtml(vdom)
      // tslint:disable-next-line
      expect(html).to.equal('<div class="outer"><div class="inner"></div><div class="component"></div><div><span>some raw HTML</span></div></div>')
      vdom.children[0].properties.onclick.handler()
      expect(model.counter).to.equal(1)
      vdom.children[0].properties.onclick.handler()
      expect(model.counter).to.equal(2)
    })
  })
})
