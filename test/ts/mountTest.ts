import * as browserMonkey from 'browser-monkey'
import {expect} from 'chai'
import * as $ from 'jquery'
import 'mocha'
import {append, html, replace} from '../..'

describe('it works with typescript', function() {
  let $appContainer: HTMLElement
  const browser = browserMonkey.find('.test-container')

  beforeEach(function() {
    $('.test-container').remove()
    const $testContainer = $('<div class="test-container"/>').appendTo(document.body)[0]
    $appContainer = $('<div class="app-container"/>').appendTo($testContainer)[0]
  })

  it('#append', async function() {
    const app = {
      render() {
        return html('div.app', 'hello ts')
      },
    }
    append($appContainer, app)
    await browser.find('.app').shouldHave({text: 'hello ts'})
  })

  it('#replace', async function() {
    const app = {
      render() {
        return html('div.app', 'hello ts')
      },
    }
    replace($appContainer, app)
    await browser.find('.app').shouldHave({text: 'hello ts'})
  })

  describe('#html', function() {
    it('makes vdom out of VdomFragment', async function() {
      const app = {
        render() {
          return html('div.app', html('div', 'hello ts'))
        },
      }
      append($appContainer, app)
      await browser.find('.app').shouldHave({text: 'hello ts'})
    })

    it('makes vdom out of undefined', async function() {
      const app = {
        render() {
          return html('div.app', undefined)
        },
      }
      append($appContainer, app)
      await browser.find('.app').shouldHave({exactText: ''})
    })
  })
})
