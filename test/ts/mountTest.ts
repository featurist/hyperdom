import * as browserMonkey from 'browser-monkey'
import {expect} from 'chai'
import * as $ from 'jquery'
import 'mocha'
import {append, html} from '../..'

describe('it works with typescript', function() {
  let div: HTMLElement
  const browser = browserMonkey.find('.test')

  beforeEach(function() {
    $('.test').remove()
    div = $('<div class="test"/>').appendTo(document.body)[0]
  })

  it('appends', async function() {
    const app = {
      render() {
        return html('div.app', 'hello ts')
      },
    }
    append(div, app)
    await browser.find('.app').shouldHave({text: 'hello ts'})
  })
})
