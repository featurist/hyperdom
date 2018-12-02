import * as $ from 'jquery'
import * as browserMonkey from 'browser-monkey'
import * as hyperdom from "../.."

const browser = browserMonkey.find('.test')

describe('tsx integration', function () {
  let $div: HTMLElement

  function mount (app: hyperdom.App | hyperdom.AppFn) {
    hyperdom.append($div, app)
  }

  beforeEach(function () {
    $('.test').remove()
    $div = $('<div class="test"/>').appendTo(document.body)[0]
  })

  it('renders standard html nodes', async function () {
    function render () {
      return <div>Blue</div>
    }
    mount(render)
    await browser.find('div').shouldHave({text: 'Blue'})
  })
})
