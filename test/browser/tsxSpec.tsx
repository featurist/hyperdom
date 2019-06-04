import * as $ from 'jquery'
import * as browserMonkey from 'browser-monkey'
import * as hyperdom from "../.."

const browser = browserMonkey.find('.test')

describe('tsx integration', function () {
  let $div: HTMLElement

  function mount (app: hyperdom.Component | hyperdom.FnComponent) {
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
    function render (this: hyperdom.FnComponent) {
      return (
        <div>
          <button binding={[this, 'name']}></button>
          <ul>
            <li key="one">one</li>
            <li key="two">two</li>
            <li key="three">three</li>
          </ul>
          <table width="100%">
            <th colSpan={2}></th>
          </table>
          <label tabindex={1} for="name">Name</label>
          <input type="text" id="name" />
        </div>
      )
    }

    class Circle extends hyperdom.RenderComponent {
      public render () {
        return <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="40" stroke="red" stroke-width="4" fill="yellow" />
        </svg>
      }
    }
  })

  it('renders hyperdom viewComponent', async function () {
    class Blue extends hyperdom.RenderComponent {
      private readonly title: string

      constructor (properties: { title: string }, readonly children: hyperdom.Renderable[]) {
        super()
        this.title = properties.title
      }

      public render () {
        return (
          <div>
            <h1>{this.title}</h1>
            {this.children}
          </div>
        )
      }
    }

    function render () {
      return (
        <div>
          <Blue title="Blue">
            <div class="orange">Orange</div>
            <div class="green">Green</div>
          </Blue>
        </div>
      )
    }
    mount(render)
    await browser.find('div h1').shouldHave({text: 'Blue'})
    await browser.find('.orange').shouldHave({text: 'Orange'})
    await browser.find('.green').shouldHave({text: 'Green'})
  })
})
