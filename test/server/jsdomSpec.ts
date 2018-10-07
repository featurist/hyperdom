import * as hyperdom from '../..'
import {JSDOM} from 'jsdom'
import {expect} from 'chai'

describe('hyperdom', function() {
  describe('.append()', function() {
    it('renders elements in jsdom', function() {
      const {window} = new JSDOM(``)
      const app = {
        render() {
          return hyperdom.html('p', 'hello')
        },
      }
      function requestRender(render: any) {
        render()
      }

      hyperdom.append(window.document.body, app, {
        document: window.document,
        requestRender,
        window,
      })
      expect(window.document.body.childNodes[0].textContent).to.equal('hello')
    })
  })
})
