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

  // just checking compilation errors here - hence xit
  xit('supports hyperdom specific node attributes', function () {
    function render (this: hyperdom.AppFn) {
      return (
        <div>
          <button binding={[this, 'name']}></button>
          <ul>
            <li key="one">one</li>
            <li key="two">two</li>
            <li key="three">three</li>
          </ul>
        </div>
      )
    }
  })

  it('renders hyperdom viewComponent', async function () {
    class Blue extends hyperdom.RenderApp {
      private readonly title: string

      constructor (properties: { title: string }, readonly children: unknown) {
        super()
        this.title = properties.title
        this.children = children
      }

      public render () {
        return <div>
          <h1>{this.title}</h1>
          {this.children}
        </div>
      }
    }

    function render () {
      return (
        <div>
          <Blue title="Blue">
            <div>Orange</div>
          </Blue>
        </div>
      )
    }
    mount(render)
    await browser.find('div h1').shouldHave({text: 'Blue'})
    await browser.find('div').shouldHave({text: 'Orange'})
  })
})
