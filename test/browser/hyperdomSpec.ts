import 'lie/polyfill'
import 'jquery-sendkeys'

import * as $ from 'jquery'
import * as hyperdom from '../..'
import * as router from '../../router'
import * as mapBinding from '../../mapBinding'
const h = hyperdom.html
const jsx = hyperdom.jsx
import {expect} from 'chai'
import * as retry from 'trytryagain'
import * as browserMonkey from 'browser-monkey'
const browser = browserMonkey.find('.test')
import * as vdomToHtml from 'vdom-to-html'
import * as times from 'lowscore/times'
import * as range from 'lowscore/range'
import vdomComponent = require('../../componentWidget')
import windowEvents = require('../../windowEvents')
import merge = require('../../merge')
import runRender = require('../../render')
import Mount = require('../../mount')
import {Component, FnComponent, RenderComponent, RoutesComponent, VdomFragment} from '../..'

const detect = {
  dataset: typeof document.body.dataset === 'object',
}

describe('hyperdom', function () {
  let div: HTMLElement

  beforeEach(function () {
    $('.test').remove()
    div = $('<div class="test"/>').appendTo(document.body)[0]
  })

  function attach (app: Component | FnComponent, model?: any) {
    const opts = [{
      requestRender: setTimeout,
    }]
    if (model) {
      opts.unshift(model)
    }
    hyperdom.append(div, app, ...opts)
  }

  function find (selector: string) {
    return $(div).find(selector)
  }

  function click (selector: string) {
    return retry(function () {
      expect(find(selector).length).to.equal(1, "could not find button '" + selector + "'")
    }).then(function () {
      find(selector).click()
    })
  }

  function check (selector: string) {
    return retry(function () {
      expect(find(selector).length).to.equal(1, "could not find button '" + selector + "'")
    }).then(function () {
      find(selector).prop('checked', true)
      find(selector).click()
    })
  }

  function renderMonitor () {
    return {
      renderCount: 0,

      rendering () {
        this.renderCount++
      },

      waitForRender () {
        return this.wait(this.renderCount)
      },

      waitForRenderAfter (action: Promise<any>) {
        return action.then(() => {
          return this.wait(this.renderCount)
        })
      },

      wait (oldRefreshCount: number) {
        return retry(() => {
          expect(this.renderCount, 'renderCount').to.equal(oldRefreshCount + 1)
        })
      },
    }
  }

  describe('attaching', function () {
    let targetDiv: HTMLElement

    beforeEach(function () {
      targetDiv = $('<div></div>').appendTo(div)[0]
    })

    it('can append an element as a child of another', function () {
      function render () {
        return h('div.rendered')
      }

      hyperdom.append(targetDiv, render)

      expect(div.innerHTML).to.equal('<div><div class="rendered"></div></div>')
    })

    it('can pass a model with a render method', function () {
      const model = new class extends RenderComponent {
        public stuff = 'stuff'
        public render () {
          return h('div.rendered', {onclick () {}}, this.stuff)
        }
      }()

      let renderRequested = false

      hyperdom.append(targetDiv, model, {
        requestRender (render) {
          renderRequested = true
          setTimeout(render)
        },
      })

      expect(div.innerHTML).to.equal('<div><div class="rendered">stuff</div></div>')
      return click('div.rendered').then(function () {
        expect(renderRequested).to.equal(true)
      })
    })

    it('can pass a synchronous reqeustRender function', function () {
      const model = new class extends RenderComponent {
        public count = 0

        public render () {
          return h('div',
            h('div.count', 'count: ' + this.count),
            h('button.add', {onclick: () => this.count++}, '++'),
          )
        }
      }()

      hyperdom.append(targetDiv, model, {
        requestRender (render) {
          render()
        },
      })

      expect(find('.count').text()).to.equal('count: 0')
      find('.add').click()
      expect(find('.count').text()).to.equal('count: 1')
      find('.add').click()
      expect(find('.count').text()).to.equal('count: 2')
      find('.add').click()
      expect(find('.count').text()).to.equal('count: 3')
    })

    it('can replace an element', function () {
      function render () {
        return h('div.rendered')
      }

      hyperdom.replace(targetDiv, render)

      expect(div.innerHTML).to.equal('<div class="rendered"></div>')
    })

    it('can append to a vdom node', function () {
      function render () {
        return h('div.rendered')
      }

      const targetVDom = h('body')

      hyperdom.appendVDom(targetVDom, render)

      expect(vdomToHtml(targetVDom)).to.contain('<div class="rendered"></div>')
    })

    describe('server-side rendering', function () {
      class MyApp extends RenderComponent {
        public name: string = 'server render'

        public render () {
          const self = this
          return h('div.static',
            h('h1', self.name),
            h('button.update',
              {
                onclick () {
                  events.push('click')
                  self.name = 'client render'
                },
              },
              'update',
            ),
          )
        }
      }

      let app: MyApp
      let events: string[]

      beforeEach(function () {
        events = []

        app = new MyApp()
      })

      it('can merge onto an existing DOM', async function () {
        $(targetDiv).replaceWith(vdomToHtml(app.render()))

        const mergeDiv = div.children[0]

        merge(mergeDiv, app, {
          requestRender: setTimeout,
        })

        await retry(function () {
          // tslint:disable-next-line
          expect(find('button.update')[0].onclick).to.exist
        })
        await click('button.update')
        await retry(function () {
          expect(find('h1').text()).to.equal('client render')
        })
      })

      it('updates client side with client-side changes', function () {
        $(targetDiv).replaceWith(vdomToHtml(app.render()))

        const mergeDiv = div.children[0]
        app.name = 'client render'
        merge(mergeDiv, app, {
          requestRender: setTimeout,
        })

        expect(find('h1').text()).to.equal('client render')
      })
    })
  })

  describe('rendering', function () {
    it('can render a div', function () {
      function render () {
        return h('div.haha')
      }

      attach(render)

      expect(find('.haha').length).to.eql(1)
    })

    it('can render pound sign', function () {
      function render () {
        return h('div', '£')
      }

      attach(render)

      expect(find('div').text()).to.eql('£')
    })

    function itCanRenderA (type: string, value: any, expectedValue?: any) {
      it('can render a ' + type, function () {
        function render () {
          return h('div.haha', value)
        }

        attach(render)

        expect(find('.haha').text()).to.eql(expectedValue !== undefined ? expectedValue : String(value))
      })
    }

    itCanRenderA('number', 4)
    itCanRenderA('boolean', true)
    itCanRenderA('date', new Date())
    itCanRenderA('undefined', undefined, '')

    it('can render an object', function () {
      function render () {
        // this is an undocumented feature that probably should be deprecated anyway
        // @ts-ignore
        return h('div.haha', 'object ', { name: 'asdf' })
      }

      attach(render)

      expect(find('.haha').text()).to.equal('object {"name":"asdf"}')
    })

    describe('class', function () {
      it('accepts a string', function () {
        function render () {
          return h('div.one', {class: 'two three'})
        }

        attach(render)

        expect(find('div').attr('class')).to.eql('one two three')
      })

      it('accepts an array of strings', function () {
        function render () {
          return h('div.one', {class: ['two', 'three']})
        }

        attach(render)

        expect(find('div').attr('class')).to.eql('one two three')
      })

      it('accepts an object', function () {
        function render () {
          return h('div.one', {class: {two: true, three: true, four: false}})
        }

        attach(render)

        expect(find('div').attr('class')).to.eql('one two three')
      })

      it('accepts an array with a mix of strings and objects', function () {
        function render () {
          return h('div.one', {
            class: ['two', ['three', {four: true, five: false}], {six: true, seven: false, eight: true}],
          })
        }

        attach(render)

        expect(find('div').attr('class')).to.eql('one two three four six eight')
      })
    })

    describe('selectors', function () {
      function selectorProduces (selector: string, expectedSelector: string) {
        it("h('" + selector + "') produces '" + expectedSelector + "'", function () {
          function render () {
            return h(selector)
          }

          attach(render)

          expect(find(expectedSelector).length).to.equal(1)
        })
      }

      selectorProduces('div.class', 'div.class')
      selectorProduces('div#id', 'div#id')
      selectorProduces('div.class#id', 'div.class#id')
      selectorProduces('h1 a', 'h1 a')
    })

    describe('attribute naming exceptions', function () {
      it('can render a "for" attribute', function () {
        function render () {
          return h('div',
              h('label', {for: 'blah'}),
            )
        }

        attach(render)

        expect(find('label').attr('for')).to.eql('blah')
      })

      it('can render a contenteditable attribute', function () {
        function render () {
          return h('div', {contenteditable: true})
        }

        attach(render)

        expect(find('div').attr('contenteditable')).to.eql('true')
      })

      it('can render a tabindex attribute', function () {
        function render () {
          return h('div', {tabindex: 3})
        }

        attach(render)

        expect(find('div').attr('tabindex')).to.eql('3')
      })

      it('can render a colspan attribute', function () {
        function render () {
          return h('table tbody tr td', {colspan: 3})
        }

        attach(render)

        expect(find('table tbody tr td').attr('colspan')).to.eql('3')
      })

      if (detect.dataset) {
        describe('data- attributes', function () {
          it('can render data- attributes', function () {
            function render () {
              return h('div', {'id': 'bals', 'data-one': 'one', 'data-two-two': 'two'})
            }

            attach(render)

            expect(find('div').data('one')).to.eql('one')
            expect(find('div').data('two-two')).to.eql('two')
          })

          it('can render data- and dataset attributes', function () {
            function render () {
              return h('div', {'data-one': 'one', 'data-two': 'two', "dataset": {three: 'three'}})
            }

            attach(render)

            expect(find('div').data('one')).to.eql('one')
            expect(find('div').data('two')).to.eql('two')
            expect(find('div').data('three')).to.eql('three')
          })
        })
      }
    })

    describe('non-standard HTML attributes', function () {
      it('can be rendered by passing an attributes object', function () {
        function render () {
          return h('div',
              h('input', {
                type: 'text',
                attributes: { autocapitalize: 'none', autofocus: true },
              }),
            )
        }

        attach(render)

        expect(find('input').attr('autocapitalize')).to.equal('none')
        expect(find('input').attr('autofocus')).to.equal('autofocus')
      })
    })

    describe('raw unescaped HTML', function () {
      it('can render raw HTML', function () {
        function render (model: any) {
          return h('div',
            model.text
              ? hyperdom.rawHtml('p', 'some <strong>dangerous HTML (' + model.text + ')')
              : undefined,
            h('button.two', {onclick () { model.text = 'two' }}),
            h('button.three', {onclick () { model.text = '' }}),
          )
        }

        attach(render, {text: 'one'})

        expect(find('p').html()).to.eql('some <strong>dangerous HTML (one)</strong>')

        return click('button.two').then(function () {
          return retry(function () {
            expect(find('p').html()).to.eql('some <strong>dangerous HTML (two)</strong>')
          }).then(function () {
            return click('button.three').then(function () {
              return retry(function () {
                expect(find('p').length).to.eql(0)
              })
            })
          })
        })
      })

      it('renders undefined as empty string', function () {
        function render () {
          return hyperdom.rawHtml('.raw', undefined)
        }

        attach(render, {text: 'one'})

        expect(find('.raw').text()).to.eql('')
      })

      it('can render raw HTML with attributes', function () {
        function render () {
          return h('div',
            hyperdom.rawHtml('p.raw', {style: {color: 'red'}}, 'some <strong>dangerous HTML'),
          )
        }

        attach(render, {text: 'one'})

        const p = find('p')
        expect(p.html()).to.eql('some <strong>dangerous HTML</strong>')
        expect(p.attr('class')).to.eql('raw')
        expect(p.attr('style')).to.eql('color: red;')
      })

      it('updates the dom when the HTML changes', function () {
        function render (model: any) {
          return h('div',
            hyperdom.rawHtml('p.raw', model.html),
            h('p.x', model.x),
            h('button.one', {onclick () { model.x = 'zzz' }}),
            h('button.two', {onclick () { model.html = 'Nice <b>HTML</b>' }}),
          )
        }

        attach(render, {html: 'Naughty <b>HTML</b>', x: 'yyy'})

        expect(find('p.raw').html()).to.equal('Naughty <b>HTML</b>')

        const b = find('p.raw b')[0]

        return click('button.one').then(function () {
          return retry(function () {
            expect(find('p.x').html()).to.equal('zzz')
          }).then(function () {
            expect(find('p.raw b')[0]).to.equal(b)
            return click('button.two').then(function () {
              return retry(function () {
                expect(find('p.raw b')[0]).not.to.equal(b)
              })
            })
          })
        })
      })
    })

    if (detect.dataset) {
      describe('source locations', function () {
        it('generates filename and line number from __source attribute', function () {
          function render () {
            return h('div', {__source: {fileName: '/full/path/to/file.jsx', lineNumber: 80}})
          }

          attach(render, {})

          expect(find('div').data('file-name')).to.eql('/full/path/to/file.jsx')
          expect(find('div').data('line-number')).to.eql(80)
        })

        contextInProduction(function () {
          it('does not generate filename and line number', function () {
            function render () {
              return h('div', {__source: {fileName: '/full/path/to/file.jsx', lineNumber: 80}})
            }

            attach(render, {})

            expect(find('div').data('file-name')).to.eql(undefined)
            expect(find('div').data('line-number')).to.eql(undefined)
          })
        })
      })
    }

    describe('rendering exceptions', function () {
      it("doesn't render anything if an exception is thrown on first render", function () {
        const app = new class extends RenderComponent {
          public render (): VdomFragment {
            throw new Error('oops')
          }
        }()

        expect(function () {
          attach(app)
        }).to.throw('oops')
      })

      it('no change to HTML if there is a rendering error', function () {
        let error: Error

        const app = new (class extends RenderComponent {
          public render () {
            if (error) {
              throw error
            } else {
              return h('h1', 'first render')
            }
          }
        })()

        attach(app)
        error = new Error('oops')
        expect(function () {
          app.refreshImmediately()
        }).to.throw('oops')
        expect(find('h1').text()).to.eql('first render')
      })
    })
  })

  describe('jsx', function () {
    it('renders', function () {
      function render () {
        return jsx('div', {class: 'one'}, [
          jsx('div', {class: 'two'}, ['text']),
        ])
      }

      attach(render, {})

      expect(find('div.one').attr('class')).to.eql('one')
      expect(find('div.one > div.two').text()).to.eql('text')
    })

    it('renders view components', function () {
      class CoolButton extends RenderComponent {
        constructor (readonly properties: any, readonly children: any) {
          super()
        }

        public render () {
          return h('button', h('span.title', this.properties.title), this.children)
        }
      }

      const app = new class extends RenderComponent {
        public render () {
          return h('div', jsx(CoolButton, {title: 'button title'}, h('h1', 'contents')))
        }
      }()

      attach(app)

      expect(find('div button span.title').text()).to.equal('button title')
    })

    it('renders svg classes', function () {
      function render () {
        return jsx('svg', {xmlns: 'http://www.w3.org/2000/svg', width: '300', height: '300'}, [
          jsx('circle', {class: 'svg-circle'}),
        ])
      }

      attach(render, {})

      expect(find('.svg-circle').length).to.eql(1)
    })

    it('renders view components without attributes', function () {
      class CoolButton extends RenderComponent {
        constructor (readonly properties: any, readonly children: any) {super()}

        public render () {
          return h('button', h('span.title', this.properties.title || 'no title'), this.children)
        }
      }

      const app = new class extends RenderComponent {
        public render () {
          return h('div', jsx(CoolButton, undefined, h('h1', 'another cool button')))
        }
      }()

      attach(app)

      expect(find('div button span.title').text()).to.equal('no title')
    })
  })

  describe('xml', function () {
    it('renders xml element all children with namespace specified with xmlns', function () {
      function render () {
        return jsx('svg', {xmlns: 'http://www.w3.org/2000/svg', width: '300', height: '300'}, [
          jsx('circle', {cx: '50', cy: '50', r: '40', stroke: 'red', 'stroke-width': '4', fill: 'yellow'}),
        ])
      }

      attach(render, {})

      expect(find('svg')[0].namespaceURI).to.eql('http://www.w3.org/2000/svg')
      expect(find('svg>circle')[0].namespaceURI).to.eql('http://www.w3.org/2000/svg')
    })

    it('renders tags with namespaces', function () {
      function render () {
        return jsx('data', {xmlns: 'urn:data', 'xmlns--addr': 'urn:address'}, [
          jsx('addr--address', {"name": 'bob', 'addr--street': 'ny st'}),
        ])
      }

      attach(render, {})

      expect(find('data')[0].namespaceURI).to.eql('urn:data')
      const address = find('data>address')[0]
      expect(address.namespaceURI).to.eql('urn:address')
      expect(address.prefix).to.eql('addr')
      const addressAttribute = address.getAttributeNodeNS('urn:address', 'street')
      expect(addressAttribute!.namespaceURI).to.eql('urn:address')
      expect(addressAttribute!.name).to.eql('addr:street')
      expect(addressAttribute!.prefix).to.eql('addr')
      expect(addressAttribute!.localName).to.eql('street')
      expect(addressAttribute!.value).to.eql('ny st')
      expect(address.getAttribute('name')).to.eql('bob')
    })

    it('inner element can declare new default namespace', function () {
      function render () {
        return jsx('data', {xmlns: 'urn:data'}, [
          jsx(
            'address', {name: 'bob', xmlns: 'urn:address', 'xmlns--addr': 'urn:address', 'addr--street': 'ny st'},
          ),
        ])
      }

      attach(render, {})

      expect(find('data')[0].namespaceURI).to.eql('urn:data')
      const address = find('data>address')[0]
      expect(address.namespaceURI).to.eql('urn:address')
      expect(address.prefix).to.eql(null)
      const addressAttribute = address.getAttributeNodeNS('urn:address', 'street')
      expect(addressAttribute).to.exist
      expect(addressAttribute!.namespaceURI).to.eql('urn:address')
      expect(addressAttribute!.name).to.eql('addr:street')
      expect(addressAttribute!.prefix).to.eql('addr')
      expect(addressAttribute!.localName).to.eql('street')
      expect(addressAttribute!.value).to.eql('ny st')
      expect(address.getAttribute('name')).to.eql('bob')
    })
  })

  describe('event handlers', function () {
    it('can respond to button clicks', function () {
      function render (model: any) {
        return h('div',
          h('button', {
            onclick () {
              model.on = true
            },
          }),
          model.on ? h('span', 'on') : undefined,
        )
      }

      attach(render, {})

      return click('button').then(function () {
        return retry(function () {
          expect(find('span').text()).to.eql('on')
        })
      })
    })

    it('can respond to button clicks after promise resolves', function () {
      function render (model: any) {
        return h('div',
          h('button', {
            onclick () {
              model.text = 'loading'
              return new Promise(function (resolve) {
                setTimeout(function () {
                  model.text = 'loaded'
                  resolve()
                }, 100)
              })
            },
          }),
          h('span', model.text),
        )
      }

      attach(render, {})

      return click('button').then(function () {
        return retry(function () {
          expect(find('span').text()).to.eql('loading')
        })
      }).then(function () {
        return retry(function () {
          expect(find('span').text()).to.eql('loaded')
        })
      })
    })

    it('refreshes the dom after an event handler promise rejects', function () {
      function render (model: {mood: string}) {
        function onclick (e: Event) {
          e.preventDefault()
          return new Promise(function (resolve, reject) {
            setTimeout(function () {
              model.mood = 'sad :('
              reject(new Error('oops'))
            }, 2)
          })
        }

        return h('.app',
          h('pre', model.mood),
          h('button', { onclick }, 'Swing'))
      }

      attach(render, { mood: 'happy :)' })

      return click('button').then(function () {
        return retry(function () {
          expect(find('pre').text()).to.eql('sad :(')
        })
      })
    })

    it('can define event handlers outside of the render loop', function () {
      const app = new (class extends RenderComponent {
        public button: VdomFragment = h('button', {
          onclick () {
            app.on = true
          },
        })
        public on: boolean

        public render () {
          return h('div',
            this.button,
            this.on ? h('span', 'on') : undefined,
          )
        }
      })()

      attach(app)

      return click('button').then(function () {
        return retry(function () {
          expect(find('span').text()).to.eql('on')
        })
      })
    })

    it('can render components outside of the render loop', function () {
      const app = new class extends RenderComponent {
        public on: boolean

        private readonly button: VdomFragment = h('div', {
          render () {
            return h('button', {
              onclick () {
                app.on = true
              },
            })
          },
        })

        public render () {
          return h('div',
            this.button,
            this.on ? h('span', 'on') : undefined,
          )
        }
      }()

      attach(app)

      return click('button').then(function () {
        return retry(function () {
          expect(find('span').text()).to.eql('on')
        })
      })
    })

    it('can render bindings outside of the render loop', function () {
      const app = new class extends RenderComponent {
        public text: string
        public input: VdomFragment

        public render () {
          return h('div',
            this.input,
            h('span', this.text),
          )
        }
      }()

      app.input = h('input', {binding: [app, 'text'], type: 'text'})

      attach(app)
      find('input').sendkeys('haha')

      return retry(function () {
        expect(find('span').text()).to.eql('haha')
      })
    })
  })

  describe('norefresh', function () {
    it("when returned the view doesn't refresh after the handler has run", function () {
      let refreshes = 0
      function render () {
        refreshes++

        return h('div',
          h('button.refresh', {
            onclick () {},
          }),
          h('button.norefresh', {
            onclick () {
              return hyperdom.norefresh()
            },
          }),
          h('span', refreshes),
        )
      }

      attach(render, {})

      return click('button.refresh').then(function () {
        return retry(function () {
          expect(refreshes).to.eql(2)
        }).then(function () {
          return click('button.norefresh').then(function () {
            return wait(10).then(function () {
              return retry(function () {
                expect(refreshes, 'expected not to refresh').to.eql(2)
              }).then(function () {
                return click('button.refresh').then(function () {
                  return retry(function () {
                    expect(refreshes, 'expected to refresh').to.eql(3)
                  })
                })
              })
            })
          })
        })
      })
    })
  })

  describe('model binding', function () {
    it('can bind to a text input', function () {
      function render (model: any) {
        return h('div',
          h('input', {type: 'text', binding: [model, 'text']}),
          h('span', model.text),
        )
      }

      attach(render, {text: ''})

      find('input').sendkeys('haha')

      return retry(function () {
        expect(find('span').text()).to.equal('haha')
        expect(find('input').val()).to.equal('haha')
      })
    })

    describe('setting input values on reused DOM elements', function () {
      it('checkbox', function () {
        function render (model: any) {
          return h('div',
            !model.hide1
              ? h('label', h('input.one', {type: 'checkbox', binding: [model, 'hide1']}), 'hide one')
              : undefined,
            !model.hide2
              ? h('label', h('input.two', {type: 'checkbox', binding: [model, 'hide2']}), 'hide two')
              : undefined,
          )
        }

        attach(render, {})

        return click('.one').then(function () {
          return retry(function () {
            expect(find('input.one').length).to.equal(0)
            expect(find('input.two').prop('checked')).to.equal(false)
          })
        })
      })

      it('radio', function () {
        function render (model: any) {
          return h('div',
            model.value === 1 ? h('h1', 'selected one') : undefined,
            h(
              'label',
              h('input.one', {type: 'radio', name: 'thingy', binding: [model, 'value'], value: 1, id: 'one'}),
              'one',
            ),
            h(
              'label',
              h('input.two', {type: 'radio', name: 'thingy', binding: [model, 'value'], value: 2, id: 'two'}),
              'two',
            ),
          )
        }

        attach(render, {value: 1})

        return check('.two').then(function () {
          return retry(function () {
            expect(find('h1').length).to.equal(0)
            expect((find('input.one')[0] as HTMLInputElement).checked).to.equal(false)
            expect((find('input.two')[0] as HTMLInputElement).checked).to.equal(true)
          })
        })
      })
    })

    describe('binding options', function () {
      it('can bind with set conversion', function () {
        const numberConversion = {
          model (view: string) {
            return Number(view)
          },

          view (model: number) {
            return String(model)
          },
        }

        function render (model: any) {
          return h('div',
            h('input', {type: 'text', binding: mapBinding(model, 'number', numberConversion)}),
            h('span', model.number),
          )
        }

        const state = {number: 0}
        attach(render, state)

        find('input').sendkeys('{selectall}{backspace}123')

        return retry(function () {
          expect(find('span').text()).to.equal('123')
          expect(find('input').val()).to.equal('123')
          expect(state.number).to.equal(123)
        })
      })

      it("doesn't set the input text if the value is an Error", function () {
        function number (value: string) {
          const n = Number(value)
          if (isNaN(n)) {
            return new Error('expected a number')
          } else {
            return n
          }
        }

        const render: FnComponent = (model: {number: number}) => {
          return h('div',
            h('input', {type: 'text', binding: mapBinding(model, 'number', number)}),
            h('span', model.number),
          )
        }

        const m = {number: 0}
        attach(render, m)

        find('input').sendkeys('{selectall}{backspace}abc')

        return retry(function () {
          expect(find('span').text()).to.equal('Error: expected a number')
          expect(find('input').val()).to.equal('abc')
          expect(m.number).to.be.instanceof(Error)
        }).then(function () {
          find('input').sendkeys('{selectall}{backspace}123')
        }).then(function () {
          return retry(function () {
            expect(find('span').text()).to.equal('123')
            expect(find('input').val()).to.equal('123')
            expect(m.number).to.equal(123)
          })
        })
      })
    })

    it('when model returns undefined, it clears the input', function () {
      function render (model: {text: string}) {
        return h('div',
          h('input', {type: 'text', binding: [model, 'text']}),
          h('button.clear', {onclick () { delete model.text }}, 'clear'),
          h('span', model.text),
        )
      }

      attach(render, {text: ''})

      find('input').sendkeys('haha')

      return retry(function () {
        expect(find('span').text()).to.equal('haha')
        expect(find('input').val()).to.equal('haha')
        return click('button.clear').then(function () {
          return retry(function () {
            expect(find('span').text()).to.equal('')
            expect(find('input').val()).to.equal('')
          })
        })
      })
    })

    it('can bind to a text input and oninput', function () {
      function render (model: {text: string, tempText: string}) {
        return h('div',
          h('input', {
            type: 'text',
            binding: [model, 'tempText'],
            oninput () {
              model.text = model.tempText
            },
          }),
          h('span', model.text),
        )
      }

      attach(render, {text: ''})

      find('input').sendkeys('haha{newline}')

      return retry(function () {
        expect(find('span').text()).to.contain('haha')
        expect(find('input').val()).to.contain('haha')
      })
    })

    it('can bind to a textarea', function () {
      function render (model: {text: string}) {
        return h('div',
          h('textarea', {binding: [model, 'text']}),
          h('span', model.text),
        )
      }

      attach(render, {text: ''})

      find('textarea').sendkeys('haha')

      return retry(function () {
        expect(find('span').text()).to.equal('haha')
        expect(find('textarea').val()).to.equal('haha')
      })
    })

    it('can bind to a checkbox', function () {
      function render (model: {check: boolean}) {
        return h('div',
          h('input', {type: 'checkbox', binding: [model, 'check']}),
          h('span', model.check ? 'on' : 'off'),
        )
      }

      attach(render, {check: false})

      return retry(function () {
        expect(find('span').text()).to.equal('off')
        expect(find('input').prop('checked')).to.equal(false)
      }).then(function () {
        find('input').click()

        return retry(function () {
          expect(find('span').text()).to.equal('on')
          expect(find('input').prop('checked')).to.equal(true)
        })
      })
    })

    it('can bind to radio buttons', function () {
      const blue = { name: 'blue' }

      function render (model: {colour: any}) {
        return h('div',
          h('input.red', {
            type: 'radio',
            name: 'colour',
            binding: [model, 'colour'],
            value: 'red',
          }),
          h('input.blue', {
            type: 'radio',
            name: 'colour',
            binding: [model, 'colour'],
            value: blue,
          }),
          h('span', JSON.stringify(model.colour)),
        )
      }

      attach(render, { colour: blue })

      return retry(function () {
        expect(find('span').text()).to.equal('{"name":"blue"}')
        expect(find('input.blue').prop('checked')).to.equal(true)
        expect(find('input.red').prop('checked')).to.equal(false)
      }).then(function () {
        find('input.red').click()

        return retry(function () {
          expect(find('span').text()).to.equal('"red"')
          expect(find('input.red').prop('checked')).to.equal(true)
        }).then(function () {
          find('input.blue').click()

          return retry(function () {
            expect(find('span').text()).to.equal('{"name":"blue"}')
            expect(find('input.blue').prop('checked')).to.equal(true)
          })
        })
      })
    })

    describe('select', function () {
      it('can bind to select', function () {
        const blue = { name: 'blue' }

        const app = new class extends RenderComponent {
          public colour = blue

          public render () {
            return h('div',
              h('select',
                {binding: [this, 'colour']},
                h('option.red', {value: 'red'}, 'red'),
                h('option.blue', {value: blue}, 'blue'),
              ),
              h('span', JSON.stringify(this.colour)),
            )
          }
        }()

        attach(app)

        return retry(function () {
          expect(find('span').text()).to.equal('{"name":"blue"}')
          expect(find('option.red').prop('selected')).to.equal(false)
          expect(find('option.blue').prop('selected')).to.equal(true)
        }).then(function () {
          (find('select')[0] as HTMLSelectElement).selectedIndex = 0
          find('select').change()

          return retry(function () {
            expect(find('span').text()).to.equal('"red"')
            expect(find('option.red').prop('selected')).to.equal(true)
          }).then(function () {
            (find('select')[0] as HTMLSelectElement).selectedIndex = 1
            find('select').change()

            return retry(function () {
              expect(find('span').text()).to.equal('{"name":"blue"}')
              expect(find('option.blue').prop('selected')).to.equal(true)
            })
          })
        })
      })

      it('can render select with text nodes', function () {
        const app = new class extends RenderComponent {
          public colour = 'red'

          public render () {
            return h('div',
              h('select',
                {binding: [this, 'colour']},
                h('option.red', {value: 'red'}, 'red'),
                '',
              ),
              h('span', JSON.stringify(this.colour)),
            )
          }
        }()

        attach(app)

        return retry(function () {
          expect(find('span').text()).to.equal('"red"')
          expect(find('option.red').prop('selected')).to.equal(true)
        })
      })

      it('can set select values', function () {
        attach(render)
        function render (model: {colour: any}) {
          return h('select',
            {binding: [model, 'colour']},
            h('option.red', {value: 'red'}, 'red'),
          )
        }
        return retry(function () {
          expect(find('option.red').prop('value')).to.equal('red')
        })
      })

      it('can bind to select with no values on its options', function () {
        const app = new class extends RenderComponent {
          public colour = 'blue'

          public render () {
            return h('div',
              h('select',
                {binding: [this, 'colour']},
                h('option.red', 're', 'd'),
                h('option.orange'),
                h('option.green', {value: 'green (not blue, ignore me)'}, 'blue'),
                h('option.blue', 'bl', 'ue'),
              ),
              h('span', JSON.stringify(this.colour)),
            )
          }
        }()

        attach(app)

        return retry(function () {
          expect(find('span').text()).to.equal('"blue"')
          expect(find('option.red').prop('selected')).to.equal(false)
          expect(find('option.blue').prop('selected')).to.equal(true)
        }).then(function () {
          (find('select')[0] as HTMLSelectElement).selectedIndex = 0
          find('select').change()

          return retry(function () {
            expect(find('span').text()).to.equal('"red"')
            expect(find('option.red').prop('selected')).to.equal(true)
          }).then(function () {
            (find('select')[0] as HTMLSelectElement).selectedIndex = 3
            find('select').change()

            return retry(function () {
              expect(find('span').text()).to.equal('"blue"')
              expect(find('option.blue').prop('selected')).to.equal(true)
            })
          })
        })
      })

      it('chooses the first if nothing is selected', function () {
        const app = new class extends RenderComponent {
          private colour: string

          public render () {
            return h('div',
              h('select',
                {binding: [this, 'colour']},
                h('option.red', 're', 'd'),
                h('option.orange'),
                h('option.green', {value: 'green (not blue, ignore me)'}, 'blue'),
                h('option.blue', 'bl', 'ue'),
              ),
              h('span', JSON.stringify(this.colour)),
            )
          }
        }()

        attach(app)

        return retry(function () {
          expect(find('option.red').prop('selected')).to.equal(true)
          expect((find('select')[0] as HTMLSelectElement).selectedIndex).to.equal(0)
        })
      })
    })
  })

  describe('components', function () {
    it('calls onload once when HTML appears on page', function () {
      const model = new class extends RenderComponent {
        private loaded = 0
        private refreshed = 0

        public onload () {
          const self = this
          return wait(20).then(function () {
            self.loaded++
          })
        }

        public render () {
          this.refreshed++
          return h('div',
            h('h1.loaded', 'loaded ' + this.loaded + ' times'),
            h('h1.refreshed', 'refreshed ' + this.refreshed + ' times'),
            h('button.refresh', {onclick () {}}, 'refresh'),
          )
        }
      }()

      attach(model)

      return retry(function () {
        expect(find('h1.loaded').text()).to.equal('loaded 1 times')
        expect(find('h1.refreshed').text()).to.equal('refreshed 2 times')
      }).then(function () {
        return click('button.refresh')
      }).then(function () {
        return retry(function () {
          expect(find('h1.loaded').text()).to.equal('loaded 1 times')
          expect(find('h1.refreshed').text()).to.equal('refreshed 3 times')
        })
      })
    })

    describe('inner components', function () {
      it('calls onload once when HTML appears on page', function () {
        const model = new class extends RenderComponent {
          private innerModel = new class extends RenderComponent {
            private loaded = 0
            private refreshed = 0

            public render () {
              this.refreshed++
              return h('div',
                h('h1.loaded', 'loaded ' + this.loaded + ' times'),
                h('h1.refreshed', 'refreshed ' + this.refreshed + ' times'),
                h('button.refresh', {onclick () {}}, 'refresh'),
              )
            }

            protected onload () {
              const self = this
              return wait(20).then(function () {
                self.loaded++
              })
            }
          }()

          public render () {
            return h('div.outer', this.innerModel)
          }
        }()

        attach(model)

        return retry(function () {
          expect(find('h1.loaded').text()).to.equal('loaded 1 times')
          expect(find('h1.refreshed').text()).to.equal('refreshed 2 times')
        }).then(function () {
          return click('button.refresh')
        }).then(function () {
          return retry(function () {
            expect(find('h1.loaded').text()).to.equal('loaded 1 times')
            expect(find('h1.refreshed').text()).to.equal('refreshed 3 times')
          })
        })
      })
    })

    it('receives onadd, onupdate and onremove events after the DOM changes have been made', function () {
      const events: Array<{
        type: string,
        element: HTMLElement,
        parent?: Node | null,
      }> = []
      const monitor = renderMonitor()

      const model = new class extends RenderComponent {
        private showComponent = true

        private innerModel = new class extends RenderComponent {
          public render () {
            return h('h1', 'component')
          }

          protected onadd (element: HTMLElement) {
            events.push({
              type: 'onadd',
              parent: element.parentNode,
              element,
            })
          }

          protected onupdate (element: HTMLElement) {
            events.push({
              type: 'onupdate',
              element,
            })
          }

          protected onremove (element: HTMLElement) {
            events.push({
              type: 'onremove',
              element,
            })
          }
        }()

        public render () {
          monitor.rendering()

          return h('div',
            this.showComponent ? this.innerModel : undefined,
            h('button.refresh', {onclick () {}}, 'refresh'),
            h('button.remove', {onclick () { model.showComponent = false }}, 'remove'),
          )
        }
      }()

      attach(model)

      const expectedParent = div.firstChild
      const expectedElement = div.firstChild!.firstChild

      return monitor.waitForRenderAfter(click('button.refresh')).then(function () {
        return monitor.waitForRenderAfter(click('button.refresh'))
      }).then(function () {
        return monitor.waitForRenderAfter(click('button.remove'))
      }).then(function () {
        expect(events).to.eql([
          {
            type: 'onadd',
            parent: expectedParent,
            element: expectedElement,
          },
          {
            type: 'onupdate',
            element: expectedElement,
          },
          {
            type: 'onupdate',
            element: expectedElement,
          },
          {
            type: 'onremove',
            element: expectedElement,
          },
        ])
      })
    })

    it('top level receives onadd, onupdate and onremove events after the DOM changes have been made', function () {
      const events: any[] = []
      const monitor = renderMonitor()

      const model = new class extends RenderComponent {
        public render () {
          monitor.rendering()

          return h('div',
            h('h1', 'component'),
            h('button.refresh', { onclick () {}}, 'refresh'),
          )
        }

        protected onadd (element: HTMLElement) {
          events.push({
            type: 'onadd',
            parent: element.parentNode,
            element,
          })
        }

        protected onupdate (element: HTMLElement) {
          events.push({
            type: 'onupdate',
            element,
          })
        }
      }()

      attach(model)

      const expectedParent = div
      const expectedElement = div.firstChild

      return monitor.waitForRenderAfter(click('button.refresh')).then(function () {
        return monitor.waitForRenderAfter(click('button.refresh'))
      }).then(function () {
        expect(events).to.eql([
          {
            type: 'onadd',
            parent: expectedParent,
            element: expectedElement,
          },
          {
            type: 'onupdate',
            element: expectedElement,
          },
          {
            type: 'onupdate',
            element: expectedElement,
          },
        ])
      })
    })

    it('calls onadd when a component of a different constructor rendered', function () {
      const events: string[] = []
      const monitor = renderMonitor()

      class ComponentA extends RenderComponent {
        public text = 'A'

        public render () {
          return h('h1', this.text)
        }

        protected onadd () {
          events.push('onadd a')
        }
      }

      class ComponentB extends RenderComponent {
        public text = 'B'

        public render () {
          return h('h1', this.text)
        }

        protected onadd () {
          events.push('onadd b')
        }
      }

      const model = new class extends RenderComponent {
        private showComponentA = true

        public render () {
          monitor.rendering()

          return h('div',
            this.showComponentA ? new ComponentA() : new ComponentB(),
            h('input.swap', {type: 'checkbox', binding: [this, 'showComponentA']}),
          )
        }
      }()

      attach(model)

      expect(events).to.eql([
        'onadd a',
      ])

      return monitor.waitForRenderAfter(click('input.swap')).then(function () {
        expect(events).to.eql([
          'onadd a',
          'onadd b',
        ])
        return monitor.waitForRenderAfter(click('input.swap'))
      }).then(function () {
        expect(events).to.eql([
          'onadd a',
          'onadd b',
          'onadd a',
        ])
        return monitor.waitForRenderAfter(click('input.swap'))
      })
    })

    it('calls onadd when a component of with a different key is rendered', function () {
      const events: string[] = []
      const monitor = renderMonitor()

      class Component extends RenderComponent {
        public text: string
        public renderKey: string | undefined

        constructor (key: string | undefined) {
          super()
          this.renderKey = key
          this.text = key || 'a'
        }

        public render () {
          return h('h1', this.text)
        }

        protected onadd () {
          events.push('onadd ' + this.text)
        }
      }

      const model = new class extends RenderComponent {
        private showComponentA = true

        public render () {
          monitor.rendering()

          return h('div',
            new Component(this.showComponentA ? undefined : 'b'),
            h('input.swap', {type: 'checkbox', binding: [this, 'showComponentA']}),
          )
        }
      }()

      attach(model)

      expect(events).to.eql([
        'onadd a',
      ])

      return monitor.waitForRenderAfter(click('input.swap')).then(function () {
        expect(events).to.eql([
          'onadd a',
          'onadd b',
        ])
        return monitor.waitForRenderAfter(click('input.swap'))
      }).then(function () {
        expect(events).to.eql([
          'onadd a',
          'onadd b',
          'onadd a',
        ])
        return monitor.waitForRenderAfter(click('input.swap'))
      })
    })

    describe('caching', function () {
      it('can update the component only when the renderKey changes', function () {
        let innerRenders = 0
        let renders = 0

        const model = new class extends RenderComponent {
          public innerModel = new class extends RenderComponent {
            public cacheKey = 1

            public render () {
              innerRenders++
              return h('button', {onclick () {}}, 'refresh')
            }

            protected renderCacheKey () {
              return this.cacheKey
            }
          }()

          public render () {
            renders++
            return this.innerModel
          }
        }()

        attach(model)

        expect(renders).to.equal(1)
        expect(innerRenders).to.equal(1)

        return click('button').then(function () {
          return retry(function () {
            expect(renders, 'renders').to.equal(2)
            expect(innerRenders, 'innerRenders').to.equal(1)
          })
        }).then(function () {
          model.innerModel.cacheKey++
          return click('button')
        }).then(function () {
          return retry(function () {
            expect(renders, 'renders').to.equal(3)
            expect(innerRenders, 'innerRenders').to.equal(2)
          })
        })
      })

      it("doesn't cache when renderCacheKey returns undefined", function () {
        let innerRenders = 0
        let renders = 0

        const model = new class extends RenderComponent {
          private innerModel = new class extends RenderComponent {
            public render () {
              innerRenders++
              return h('button', {onclick () {}}, 'refresh')
            }
            protected renderCacheKey () {}
          }()

          public render () {
            renders++
            return this.innerModel
          }
        }()

        attach(model)

        expect(renders).to.equal(1)
        expect(innerRenders).to.equal(1)

        return click('button').then(function () {
          return retry(function () {
            expect(renders, 'renders').to.equal(2)
            expect(innerRenders, 'innerRenders').to.equal(2)
          })
        }).then(function () {
          return click('button')
        }).then(function () {
          return retry(function () {
            expect(renders, 'renders').to.equal(3)
            expect(innerRenders, 'innerRenders').to.equal(3)
          })
        })
      })
    })

    it('the component can refresh the view', function () {
      const model = new class extends RenderComponent {
        public name = 'Njord'

        public render () {
          return h('h1', 'hi ' + this.name)
        }
      }()

      attach(model)

      expect(find('h1').text()).to.equal('hi Njord')

      model.name = 'Hayfa'
      model.refresh()

      return retry(function () {
        expect(find('h1').text()).to.equal('hi Hayfa')
      })
    })

    it('can refresh several components without refreshing the whole page', function () {
      const model = new class extends RenderComponent {
        public model1 = innerModel('model1', 'one')
        public model2 = innerModel('model2', 'xxx')

        public render () {
          return h('div', this.model1, this.model2)
        }
      }()

      function innerModel (klass: string, name: string) {
        return new class extends RenderComponent {
          public name = name

          public render () {
            return h('h1' + '.' + klass, 'hi ' + this.name)
          }
        }()
      }

      attach(model)

      expect(find('h1.model1').text()).to.equal('hi one')
      expect(find('h1.model2').text()).to.equal('hi xxx')

      model.model1.name = 'two'
      model.model2.name = 'yyy'
      model.model1.refreshComponent()

      return retry(function () {
        expect(find('h1.model1').text()).to.equal('hi two')
        expect(find('h1.model2').text()).to.equal('hi xxx')
      }).then(function () {
        model.model2.refreshComponent()
      }).then(function () {
        return retry(function () {
          expect(find('h1.model1').text()).to.equal('hi two')
          expect(find('h1.model2').text()).to.equal('hi yyy')
        })
      }).then(function () {
        model.model1.name = 'three'
        model.model2.name = 'zzz'

        model.model1.refreshComponent()
        model.model2.refreshComponent()

        return retry(function () {
          expect(find('h1.model1').text()).to.equal('hi three')
          expect(find('h1.model2').text()).to.equal('hi zzz')
        })
      })
    })

    it('does not refresh if the component was not rendered', function () {
      const model = new class extends RenderComponent {
        public showModel = 1

        public model1 = innerModel('one')
        public model2 = innerModel('two')

        public render () {
          return h('div', this.showModel === 1 ? this.model1 : this.model2)
        }
      }()

      function innerModel (name: string) {
        return new class extends RenderComponent {
          public name = name

          public render () {
            return h('h1', 'hi ' + this.name)
          }
        }()
      }

      attach(model)

      expect(find('h1').text()).to.equal('hi one')

      model.showModel = 2
      model.refresh()

      return retry(function () {
        expect(find('h1').text()).to.equal('hi two')
      }).then(function () {
        model.model1.name = 'one updated'
        model.model1.refreshComponent()
      }).then(function () {
        return wait(10)
      }).then(function () {
        return retry(function () {
          expect(find('h1').text()).to.equal('hi two')
        })
      })
    })

    it('a component can be represented several times and be refreshed', function () {
      const model = new class extends RenderComponent {
        public models = 1

        public innerModel = new class extends RenderComponent {
          public name = 'Jack'

          public render () {
            return h('li', this.name)
          }
        }()

        public render () {
          return h('ul', times(this.models, () => {
            return this.innerModel
          }))
        }
      }()

      attach(model)

      expect(find('ul').text()).to.equal('Jack')

      model.innerModel.name = 'Jill'
      model.innerModel.refreshComponent()

      return retry(function () {
        expect(find('ul').text()).to.equal('Jill')
      }).then(function () {
        model.models = 3
        model.refresh()
      }).then(function () {
        return retry(function () {
          expect(find('ul').text()).to.equal('JillJillJill')
        })
      }).then(function () {
        model.innerModel.name = 'Jacky'
        model.innerModel.refreshComponent()

        return retry(function () {
          expect(find('ul').text()).to.equal('JackyJackyJacky')
        })
      }).then(function () {
        model.models = 2
        model.refresh()
      }).then(function () {
        return retry(function () {
          expect(find('ul').text()).to.equal('JackyJacky')
        })
      }).then(function () {
        model.innerModel.name = 'Joel'
        model.innerModel.refreshComponent()

        return retry(function () {
          expect(find('ul').text()).to.equal('JoelJoel')
        })
      })
    })

    it('calling refreshImmediately inside a render does nothing', function () {
      const model = new class extends RenderComponent {
        public render () {
          this.refreshImmediately()
          return h('h1', 'hi')
        }
      }()

      attach(model)
      expect(find('h1').text()).to.equal('hi')
    })
  })

  describe('hyperdom.binding', function () {
    describe('validation', function () {
      it('throws if a string is passed', function () {
        expect(function () {
          hyperdom.binding('asdf' as any)
        }).to.throw(/bindings must be.*or an object.*asdf/)
      })
    })
  })

  describe('hyperdom.refreshify', function () {
    this.timeout(2000)
    let refreshCalled: boolean

    beforeEach(function () {
      refreshCalled = false
      const mount = new Mount()

      runRender._currentRender = {
        mount: {
          refresh () {
            refreshCalled = true
          },

          requestRender (fn: () => void) {
            fn()
          },

          refreshify (fn: () => void, options: object) {
            return mount.refreshify.call(this, fn, options)
          },
        },
      }
    })

    afterEach(function () {
      runRender._currentRender = undefined
    })

    function expectToRefresh (options: object | undefined, v: boolean) {
      (hyperdom.refreshify(function () {}, options))()
      expect(refreshCalled).to.equal(v)
    }

    interface IExpectations {
      immediately: boolean
      afterPromise: boolean
    }

    function expectPromiseToRefreshWithOptions (options: object | undefined, expectations: IExpectations) {
      const fn = hyperdom.refreshify(function () {
        return wait(10)
      }, options)

      return expectPromiseToRefreshWithBinding(fn, expectations)
    }

    function expectPromiseToRefreshWithBinding (fn: () => void, expectations: IExpectations) {
      fn()

      expect(refreshCalled).to.equal(expectations.immediately)
      refreshCalled = false

      return wait(20).then(function () {
        expect(refreshCalled).to.equal(expectations.afterPromise)
      })
    }

    context('normal', function () {
      it('normally calls refresh', function () {
        expectToRefresh(undefined, true)
      })

      it('normally calls refresh, even after a promise', function () {
        return expectPromiseToRefreshWithOptions(undefined, {immediately: true, afterPromise: true})
      })
    })

    context('component: old component', function () {
      it('calls refresh with the component', function () {
        const component = {
          canRefresh: true,
          wasRefreshed: false,
          refresh () {
            this.wasRefreshed = true
          },
        };

        (hyperdom.refreshify(function () {}, {component}))()
        expect(component.wasRefreshed).to.equal(true)
      })
    })

    context('component: component', function () {
      it('calls refresh with the component', function () {
        const component = {
          wasRefreshed: false,
          refreshComponent () {
            this.wasRefreshed = true
          },
        };

        (hyperdom.refreshify(function () {}, {component}))()
        expect(component.wasRefreshed).to.equal(true)
      })
    })

    context('norefresh: true', function () {
      it('never calls refresh', function () {
        expectToRefresh({norefresh: true}, false)
      })

      it('never calls refresh, even after promise', function () {
        return expectPromiseToRefreshWithOptions({norefresh: true}, {immediately: false, afterPromise: false})
      })
    })

    context('refresh: false', function () {
      it('never calls refresh', function () {
        expectToRefresh({refresh: false}, false)
      })

      it('never calls refresh, even after promise', function () {
        return expectPromiseToRefreshWithOptions({refresh: false}, {immediately: false, afterPromise: false})
      })
    })

    context("refresh: 'promise'", function () {
      it('never calls refresh', function () {
        expectToRefresh({refresh: 'promise'}, false)
      })

      it("doesn't call refresh, but does after a promise", function () {
        return expectPromiseToRefreshWithOptions({refresh: 'promise'}, {immediately: false, afterPromise: true})
      })
    })
  })

  describe('html.meta()', function () {
    it('stores temporary state without updating the model', function () {
      const integer = {
        view (model: any) {
          return (model || '').toString()
        },
        model (view: any) {
          if (!/^\d+$/.test(view)) { throw new Error('Must be an integer') }
          return Number(view)
        },
      }
      function render (model: any) {
        return h('div',
          h('input.x', {binding: mapBinding(model, 'x', integer)}),
        )
      }
      const model: any = {}
      attach(render, model)

      return browser.find('input.x').typeIn('1').then(function () {
        return retry(function () {
          expect(model.x).to.equal(1)
        })
      }).then(function () {
        return browser.find('input.x').typeIn('x')
      }).then(function () {
        return retry(function () {
          expect(hyperdom.html.meta(model, 'x').error.message).to.equal('Must be an integer')
          expect(model.x).to.equal(1)
        })
      })
    })
  })

  describe('components', function () {
    let events: any[]
    let monitor: any
    let renderData: string
    let renderCacheKey: string

    beforeEach(function () {
      monitor = renderMonitor()
      events = []

      renderData = 'one'
      renderCacheKey = 'one'
    })

    function trimH1 (innerHTML: string) {
      return /<h1>.*?<\/h1>/.exec(innerHTML)![0]
    }

    function component (options?: any): any {
      const render = typeof options === 'object' && options.hasOwnProperty('render') ? options.render : undefined

      return {
        onload () {
          events.push(['onload'])
          this.state = 'state'
        },

        onbeforeadd () {
          events.push(['onbeforeadd', this.state])
        },

        onadd (element: HTMLElement) {
          events.push(['onadd', trimH1(element.innerHTML), this.state])
        },

        onbeforerender (element: HTMLElement) {
          events.push(['onbeforerender', element ? trimH1(element.innerHTML) : null, this.state])
        },

        onrender (element: HTMLElement, oldElement: HTMLElement) {
          events.push(
            ['onrender', trimH1(element.innerHTML), oldElement ? trimH1(oldElement.innerHTML) : null, this.state],
          )
        },

        onbeforeupdate (element: HTMLElement) {
          events.push(['onbeforeupdate', trimH1(element.innerHTML), this.state])
        },

        onupdate (element: HTMLElement, oldElement: HTMLElement) {
          events.push(['onupdate', trimH1(element.innerHTML), trimH1(oldElement.innerHTML), this.state])
        },

        onbeforeremove (element: HTMLElement) {
          events.push(['onbeforeremove', trimH1(element.innerHTML), this.state])
        },

        onremove (element: HTMLElement) {
          events.push(['onremove', trimH1(element.innerHTML), this.state])
        },

        render () {
          return h('div', h('h1', 'element: ' + monitor.renderCount), render ? render() : '')
        },
      }
    }

    function cachingComponent (render?: () => any): any {
      return {
        onload () {
          events.push('onload')
          this.lastState = 'load'
        },

        onbeforeadd () {
          events.push('onbeforeadd')
          this.lastState = 'beforeadd'
        },

        onadd (element: HTMLElement) {
          events.push('onadd')
          this.lastState = 'add'
        },

        onbeforerender (element: HTMLElement) {
          events.push('onbeforerender')
        },

        onrender (element: HTMLElement, oldElement: HTMLElement) {
          events.push('onrender')
        },

        onbeforeupdate (element: HTMLElement) {
          events.push('onbeforeupdate')
          this.lastState = 'beforeupdate'
        },

        onupdate (element: HTMLElement, oldElement: HTMLElement) {
          events.push('onupdate')
          this.lastState = 'update'
        },

        onbeforeremove (element: HTMLElement) {
          events.push('onbeforeremove')
          this.lastState = 'beforeremove'
        },

        onremove (element: HTMLElement) {
          events.push('onremove')
          this.lastState = 'remove'
        },

        renderCacheKey () {
          monitor.rendering()
          return renderCacheKey
        },

        render () {
          return h('div',
            h('h1', 'element: ' + renderData),
            render ? render() : '',
          )
        },
      }
    }

    function respondsToEvents (options?: {remove: boolean}) {
      function elementHtml () {
        return '<h1>element: ' + (monitor.renderCount - renderOffset) + '</h1>'
      }

      function oldElementHtml () {
        return '<h1>element: ' + (monitor.renderCount - renderOffset - 1) + '</h1>'
      }

      let clickAdd: Promise<any>
      let renderOffset: number

      if (!(options && options.remove === false)) {
        renderOffset = 0
        clickAdd = monitor.waitForRenderAfter(click('button.add'))
      } else {
        renderOffset = 1
        clickAdd = Promise.resolve()
      }

      return clickAdd.then(function () {
        expect(events).to.eql([
          ['onload'],
          ['onbeforeadd', 'state'],
          ['onbeforerender', null, 'state'],
          ['onadd', elementHtml(), 'state'],
          ['onrender', elementHtml(), null, 'state'],
        ])
        events = []

        return monitor.waitForRenderAfter(click('button.update'))
      }).then(function () {
        expect(events).to.eql([
          ['onbeforeupdate', oldElementHtml(), 'state'],
          ['onbeforerender', oldElementHtml(), 'state'],
          ['onupdate', elementHtml(), elementHtml(), 'state'],
          ['onrender', elementHtml(), elementHtml(), 'state'],
        ])
        events = []

        if (!(options && options.remove === false)) {
          return monitor.waitForRenderAfter(click('button.remove')).then(function () {
            expect(events).to.eql([
              ['onbeforeremove', oldElementHtml(), 'state'],
              ['onremove', oldElementHtml(), 'state'],
            ])
          })
        }
      })
    }

    function canCache () {
      expect(find('h1').text()).to.equal('element: one')
      expect(events).to.eql([
        'onload',
        'onbeforeadd',
        'onbeforerender',
        'onadd',
        'onrender',
      ])
      events = []

      renderData = 'two'
      return monitor.waitForRenderAfter(click('button.update')).then(function () {
        expect(find('h1').text()).to.equal('element: one')

        expect(events).to.eql([
        ])
        events = []

        renderCacheKey = 'two'
        return monitor.waitForRenderAfter(click('button.update'))
      }).then(function () {
        expect(find('h1').text()).to.equal('element: two')

        expect(events).to.eql([
          'onbeforeupdate',
          'onbeforerender',
          'onupdate',
          'onrender',
        ])
        events = []
      })
    }

    context('model components', function () {
      it('captures lifetime events', function () {
        const model = new class extends RenderComponent {
          public show = false

          private innerModel = component()

          public render () {
            monitor.rendering()

            this.innerModel.data = monitor.renderCount

            return h('div',
              this.show ? this.innerModel : undefined,
              h('button.add', {onclick () { model.show = true }}, 'add'),
              h('button.update', {onclick () {}}, 'update'),
              h('button.remove', {onclick () { model.show = false }}, 'remove'),
            )
          }
        }()

        attach(model)

        return respondsToEvents()
      })

      it('can cache', function () {
        const app = new class extends RenderComponent {
          private innerModel = cachingComponent()

          public render () {
            return h('div',
              this.innerModel,
              h('button.update', {onclick () {}}, 'update'),
            )
          }
        }()

        attach(app)

        return canCache()
      })
    })

    context('top level model components', function () {
      it('captures lifetime events', function () {
        const model = component({
          render () {
            monitor.rendering()
            return h('div',
              h('button.add', {onclick () { model.show = true }}, 'add'),
              h('button.update', {onclick () {}}, 'update'),
            )
          },
        })

        attach(model)

        return respondsToEvents({remove: false})
      })

      it('can cache', function () {
        const app = cachingComponent(function () {
          return h('button.update', {onclick () {}}, 'update')
        })

        attach(app)

        return canCache()
      })
    })

    context('view components', function () {
      it('captures lifetime events', function () {
        const app = new class extends RenderComponent {
          private show = false
          public render () {
            monitor.rendering()
            return h('div',
              this.show
                ? hyperdom.viewComponent(component())
                : undefined,
              h('button.add', {onclick () { app.show = true }}, 'add'),
              h('button.remove', {onclick () { app.show = false }}, 'remove'),
              h('button.update', {onclick () {}}, 'update'),
            )
          }
        }()

        attach(app)

        return respondsToEvents()
      })

      it('can cache', function () {
        const app = new class extends RenderComponent {
          public render () {
            return h('div',
              hyperdom.viewComponent(cachingComponent()),
              h('button.update', {onclick () {}}, 'update'),
            )
          }
        }()

        attach(app)

        return canCache()
      })
    })
  })

  describe('component debugger', function () {
    contextInProduction(function () {
      it('does not set debugging properties', function () {
        const inner = new class extends RenderComponent {
          public render () {
            return h('div.inner', 'inner')
          }
        }()

        const outer = new class extends RenderComponent {
          public render () {
            return h('div.outer', 'outer', inner)
          }
        }()

        attach(outer)

        expect((find('.outer')[0] as any)._hyperdomMeta).to.eql(undefined)
        expect((find('.inner')[0] as any)._hyperdomMeta).to.eql(undefined)
      })
    })

    it('sets the component to the element', function () {
      const inner = new class extends RenderComponent {
        public render () {
          return h('div.inner', 'inner')
        }
      }()

      const outer = new class extends RenderComponent {
        public render () {
          return h('div.outer', 'outer', inner)
        }
      }()

      attach(outer)

      expect((find('.outer')[0] as any)._hyperdomMeta.component).to.eql(outer)
      expect((find('.inner')[0] as any)._hyperdomMeta.component).to.eql(inner)
    })

    afterEach(function () {
      router.reset()
    })

    it('an application with routes sets the component to the element', function () {
      const inner = new class extends RenderComponent {
        public render () {
          return h('div.inner', 'inner')
        }
      }()

      const home = router.route('**')

      const outer = new class extends RoutesComponent {
        public routes () {
          return [
            home({
              render () {
                return h('div.outer', 'outer', inner)
              },
            }),
          ]
        }
      }()

      hyperdom.append(div, outer, {router})

      expect((find('.outer')[0] as any)._hyperdomMeta.component).to.eql(outer)
      expect((find('.inner')[0] as any)._hyperdomMeta.component).to.eql(inner)
    })

    it('an application with routes sets the component to the element', function () {
      const inner = new class extends RenderComponent {
        public render () {
          return h('div.inner', 'inner')
        }
      }()

      const home = router.route('**')

      const outer = new class extends RoutesComponent {
        public routes () {
          return [
            home({
              render () {
                return inner
              },
            }),
          ]
        }

        public renderLayout (content: any) {
          return h('div.outer', 'outer', content)
        }
      }()

      hyperdom.append(div, outer, {router})

      expect((find('.outer')[0] as any)._hyperdomMeta.component).to.eql(outer)
      expect((find('.inner')[0] as any)._hyperdomMeta.component).to.eql(inner)
    })
  })

  describe('keys', function () {
    it('keeps HTML elements for same keys', function () {
      const items = range(1, 11)
      const app = new class extends RenderComponent {
        public render () {
          return h('div', items.map(function (item: any) {
            return h('div.item', {key: item}, item)
          }))
        }
      }()

      attach(app)

      return browser.find('div.item').shouldHave({
        text: items.map(function (item: any) {
          return String(item)
        }),
      }).then(function () {
        const two = document.querySelector('div.item:nth-child(2)')
        items.shift()
        app.refresh()
        return browser.find('div.item').shouldHave({
          text: items.map(function (item: any) {
            return String(item)
          }),
        }).then(function () {
          expect((two as HTMLElement)!.innerText).to.equal('2')
        })
      })
    })
  })

  describe('v1 compatibility', function () {
    describe('hyperdom.html.refresh', function () {
      it('refreshes the UI when called', function () {
        function render (model: {text: string}) {
          const refresh = h.refresh

          return h('div',
            h('h1', model.text),
            h('button.refresh', {
              onclick () {
                setTimeout(function () {
                  model.text = 'after timeout'
                  refresh()
                }, 50)
              },
            },
            'refresh'),
          )
        }

        attach(render, {text: 'before timeout'})

        return click('button.refresh').then(function () {
          return wait(20).then(function () {
            return retry(function () {
              expect(find('h1').text()).to.equal('before timeout')
            }).then(function () {
              return retry(function () {
                expect(find('h1').text()).to.equal('after timeout')
              })
            })
          })
        })
      })

      it('refreshes a component when called with that component', function () {
        function render (model: {text: string}) {
          const refresh = h.refresh
          const component = vdomComponent(function () { return h('h2', model.text) })

          return h('div',
            h('h1', model.text),
            component,
            h('button.refresh', {
              onclick () {
                setTimeout(function () {
                  model.text = 'after timeout'
                  refresh(component)
                }, 50)
              },
            },
            'refresh'),
          )
        }

        attach(render, {text: 'before timeout'})

        return click('button.refresh').then(function () {
          return wait(20).then(function () {
            return retry(function () {
              expect(find('h1').text()).to.equal('before timeout')
              expect(find('h2').text()).to.equal('before timeout')
            }).then(function () {
              return retry(function () {
                expect(find('h1').text()).to.equal('before timeout')
                expect(find('h2').text()).to.equal('after timeout')
              })
            })
          })
        })
      })

      it('updates the component when refreshed', function () {
        const monitor = renderMonitor()
        let updated = 0
        let rendered = 0

        function render (model: {text: string}) {
          const refresh = h.refresh
          monitor.rendering()

          const component = vdomComponent(
            {
              cacheKey: true,
              onupdate () {
                updated++
              },
            },
            function () {
              rendered++
              return h('h2', model.text)
            },
          )

          return h('div',
            component,
            h('button.refresh', {
              onclick () {
                monitor.waitForRender().then(function () {
                  refresh(component)
                })
              },
            },
            'refresh'),
          )
        }

        attach(render, {text: 'before timeout'})

        expect(updated).to.equal(0)
        expect(rendered).to.equal(1)

        return click('button.refresh').then(function () {
          return retry(function () {
            expect(updated).to.equal(1)
            expect(rendered).to.equal(2)
          })
        })
      })

      it('refreshes whole page if passed a non-component', function () {
        function render (model: {text: string}) {
          const refresh = h.refresh

          return h('div',
            h('h1', model.text),
            h('button.refresh', {
              onclick () {
                setTimeout(function () {
                  model.text = 'after timeout'
                  refresh({})
                }, 50)
              },
            },
            'refresh'),
          )
        }

        attach(render, {text: 'before timeout'})

        return click('button.refresh').then(function () {
          return wait(20).then(function () {
            return retry(function () {
              expect(find('h1').text()).to.equal('before timeout')
            }).then(function () {
              return retry(function () {
                expect(find('h1').text()).to.equal('after timeout')
              })
            })
          })
        })
      })

      it('must be taken during render cycle, or exception is thrown', function () {
        function render (model: {text: string}) {
          const refresh = h.refresh

          return h('div',
            h('h1', model.text),
            h('button.refresh', {
              onclick () {
                setTimeout(function () {
                  try {
                    model.text = 'after timeout'
                    h.refresh()
                  } catch (e) {
                    model.text = e.message
                    refresh()
                  }
                }, 50)
              },
            },
            'refresh'),
          )
        }

        attach(render, {text: 'before timeout'})

        return click('button.refresh').then(function () {
          return wait(20).then(function () {
            return retry(function () {
              expect(find('h1').text()).to.equal('before timeout')
            }).then(function () {
              return retry(function () {
                expect(find('h1').text()).to.include('hyperdom.html.refresh')
              })
            })
          })
        })
      })
    })

    describe('hyperdom.html.window', function () {
      it('can add and remove event handlers on window', function () {
        function render (model: {active: boolean, clicks: number}) {
          return h('div',
            model.active
              ? windowEvents(
                {
                  onclick () {
                    model.clicks++
                  },
                },
                )
              : undefined,
            model.active
              ? h('button.disactivate', {onclick () { model.active = false; return false }}, 'disactivate')
              : h('button.activate', {onclick () { model.active = true; return false }}, 'activate'),
            h('div.click', 'click here'),
            h('div.clicks', model.clicks),
          )
        }

        attach(render, {clicks: 0, active: false})

        return click('button.activate').then(function () {
          return retry(function () {
            return expect(find('button.disactivate').length).to.equal(1)
          }).then(function () {
            return click('div.click').then(function () {
              return retry(function () {
                expect(find('div.clicks').text()).to.equal('1')
              }).then(function () {
                return click('button.disactivate').then(function () {
                  return retry(function () {
                    expect(find('button.activate').length).to.equal(1)
                  }).then(function () {
                    return click('div.click').then(function () {
                      return wait(30).then(function () {
                        return retry(function () {
                          expect(find('div.clicks').text()).to.equal('1')
                        })
                      })
                    })
                  })
                })
              })
            })
          })
        })
      })
    })

    describe('hyperdom.html.component', function () {
      it('receives onadd, onupdate and onremove events after the DOM changes have been made', function () {
        const events: any[] = []
        let componentState: any
        const monitor = renderMonitor()

        function render (model: {showComponent: boolean}) {
          monitor.rendering()

          return h('div',
            model.showComponent
              ? vdomComponent({
                onadd (element: HTMLElement) {
                  events.push({
                    type: 'onadd',
                    parent: element.parentNode,
                    element,
                  })
                  componentState = this
                },
                onupdate (element: HTMLElement) {
                  events.push({
                    type: 'onupdate',
                    element,
                    state: this,
                  })
                },
                onremove (element: HTMLElement) {
                  events.push({
                    type: 'onremove',
                    element,
                    state: this,
                  })
                },
              }, h('h1', 'component'))
              : undefined,
            h('button.refresh', {onclick () {}}, 'refresh'),
            h('button.remove', {onclick () { model.showComponent = false }}, 'remove'),
          )
        }

        attach(render, {showComponent: true})

        const expectedParent = div.firstChild
        const expectedElement = div.firstChild!.firstChild

        return monitor.waitForRenderAfter(click('button.refresh')).then(function () {
          return monitor.waitForRenderAfter(click('button.refresh'))
        }).then(function () {
          return monitor.waitForRenderAfter(click('button.remove'))
        }).then(function () {
          expect(events).to.eql([
            {
              type: 'onadd',
              parent: expectedParent,
              element: expectedElement,
            },
            {
              type: 'onupdate',
              element: expectedElement,
              state: componentState,
            },
            {
              type: 'onupdate',
              element: expectedElement,
              state: componentState,
            },
            {
              type: 'onremove',
              element: expectedElement,
              state: componentState,
            },
          ])
        })
      })

      it('throws error if not given vdom', function () {
        function render () {
          return vdomComponent(
            {
              // @ts-ignore
              onadd () {

              },
            },
          )
        }

        expect(function () { attach(render) }).to.throw('expects a vdom argument')
      })

      it('can expose long-running state for components', function () {
        function render () {
          return vdomComponent(
            {
              onbeforeadd () {
                // @ts-ignore
                this.counter = 2
              },
            },
            function () {
              const self = this

              return h('div',
                // @ts-ignore
                h('span.counter', this.counter),
                // @ts-ignore
                h('button.add', {onclick () { self.counter++ }}, 'add'),
              )
            },
          )
        }

        attach(render, {counter: 0})

        return retry(function () {
          expect(find('span.counter').text()).to.equal('2')
        }).then(function () {
          return click('button.add')
        }).then(function () {
          return retry(function () {
            expect(find('span.counter').text()).to.equal('3')
          })
        }).then(function () {
          return click('button.add')
        }).then(function () {
          return retry(function () {
            expect(find('span.counter').text()).to.equal('4')
          })
        })
      })

      it('renders and updates the vdom inside the component', function () {
        function render (model: {counter: number}) {
          return h('div',
            vdomComponent({}, h('span.counter', model.counter)),
            h('button.add', {onclick () { model.counter++ }}, 'add'),
          )
        }

        attach(render, {counter: 0})

        return click('button.add').then(function () {
          return wait(30).then(function () {
            return retry(function () {
              expect(find('span.counter').text()).to.equal('1')
            }).then(function () {
              return click('button.add').then(function () {
                return retry(function () {
                  expect(find('span.counter').text()).to.equal('2')
                })
              })
            })
          })
        })
      })

      it('only refreshes the component when returned from an event', function () {
        function render (model: {counter: number}) {
          return h('div',
            vdomComponent(function (component: any) {
              return h('div',
                h('span.inner-counter', model.counter),
                h('button.add-inner', {onclick () { model.counter++; return component }}, 'add inner'),
              )
            }),
            h('span.outer-counter', model.counter),
            h('button.add-outer', {onclick () { model.counter++ }}, 'add outer'),
          )
        }

        attach(render, {counter: 0})

        expect(find('span.inner-counter').text()).to.equal('0')
        expect(find('span.outer-counter').text()).to.equal('0')

        return click('button.add-inner').then(function () {
          return retry(function () {
            expect(find('span.inner-counter').text()).to.equal('1')
            expect(find('span.outer-counter').text()).to.equal('0')
          })
        }).then(function () {
          return click('button.add-inner')
        }).then(function () {
          return retry(function () {
            expect(find('span.inner-counter').text()).to.equal('2')
            expect(find('span.outer-counter').text()).to.equal('0')
          })
        }).then(function () {
          return click('button.add-outer').then(function () {
            return retry(function () {
              expect(find('span.inner-counter').text()).to.equal('3')
              expect(find('span.outer-counter').text()).to.equal('3')
            })
          })
        })
      })

      it('only refreshes array of the components when returned from an event', function () {
        function render (model: {counter: number}) {
          const component1 = vdomComponent(function (component: any) {
            return h('div',
                h('span.inner-counter', model.counter),
                h('button.add-inner', {onclick () { model.counter++; return component }}, 'add inner'),
              )
          })

          return h('div',
            component1,
            vdomComponent(function (component: any) {
              return h('div',
                h('span.inner-counter2', model.counter),
                h('button.add-inner2', {onclick () { model.counter++; return [component, component1] }}, 'add inner 2'),
              )
            }),
            h('span.outer-counter', model.counter),
            h('button.add-outer', {onclick () { model.counter++ }}, 'add outer'),
          )
        }

        attach(render, {counter: 0})

        expect(find('span.inner-counter').text()).to.equal('0')
        expect(find('span.inner-counter2').text()).to.equal('0')
        expect(find('span.outer-counter').text()).to.equal('0')

        return click('button.add-inner').then(function () {
          return retry(function () {
            expect(find('span.inner-counter').text()).to.equal('1')
            expect(find('span.inner-counter2').text()).to.equal('0')
            expect(find('span.outer-counter').text()).to.equal('0')
          })
        }).then(function () {
          return click('button.add-inner2')
        }).then(function () {
          return retry(function () {
            expect(find('span.inner-counter').text()).to.equal('2')
            expect(find('span.inner-counter2').text()).to.equal('2')
            expect(find('span.outer-counter').text()).to.equal('0')
          })
        }).then(function () {
          return click('button.add-outer').then(function () {
            return retry(function () {
              expect(find('span.inner-counter').text()).to.equal('3')
              expect(find('span.inner-counter2').text()).to.equal('3')
              expect(find('span.outer-counter').text()).to.equal('3')
            })
          })
        })
      })

      it('throws exception when component is returned from event but does not have a render function', function () {
        function render (model: {counter: number}) {
          const component = vdomComponent(h('span.inner-counter', model.counter))

          return h('div',
            component,
            h('button', { onclick () { return component } }, 'refresh component'),
          )
        }

        attach(render, {})

        return click('button').then(undefined, function (error: Error) {
          expect(error.message).to.contain('refresh')
        })
      })

      it('can refresh the component when returned from an event, and handle lifetime events', function () {
        const events: any[] = []
        let refreshCount = 0

        function render (model: {show: boolean}) {
          refreshCount++
          return h('div',
            model.show
              ? vdomComponent(
                  vdomComponent(
                    {
                      onadd () {
                        events.push('add')
                      },
                      onupdate () {
                        events.push('update')
                      },
                      onremove () {
                        events.push('remove')
                      },
                    },
                    function () {
                      return h('div', 'rest of the content')
                    },
                  ),
                )
              : undefined,
            h('button.refresh', {onclick () {}}, 'refresh'),
            h('label', 'show', h('input.show', {type: 'checkbox', binding: [model, 'show']})),
          )
        }

        const waitForRefresh = (function () {
          let oldRefreshCount = 1
          return function () {
            return retry(function () {
              expect(refreshCount).to.equal(oldRefreshCount + 1)
            }).then(function () {
              oldRefreshCount = refreshCount
            })
          }
        })()

        attach(render, {})

        return click('input.show').then(function () {
          return waitForRefresh().then(function () {
            return click('button.refresh').then(function () {
              return waitForRefresh().then(function () {
                return click('button.refresh').then(function () {
                  return waitForRefresh().then(function () {
                    return click('input.show').then(function () {
                      return retry(function () {
                        expect(events).to.eql([
                          'add',
                          'update',
                          'update',
                          'remove',
                        ])
                      })
                    })
                  })
                })
              })
            })
          })
        })
      })

      it('can capture fields from each refresh', function () {
        const events: any[] = []

        function render (model: {value: number}) {
          model.value++
          const refresh = h.refresh

          return h('div',
            vdomComponent(
              {
                value: model.value,

                onadd (element: HTMLElement) {
                  const self = this
                  element.addEventListener('click', function () {
                    events.push(self.value)
                    refresh()
                  })
                },
              },
              h('.button-' + model.value, 'click me'),
            ),
          )
        }

        attach(render, {value: 0})
        return click('.button-1').then(function () {
          expect(events).to.eql([1])
        }).then(function () {
          return click('.button-2').then(function () {
            expect(events).to.eql([1, 2])
          })
        })
      })

      it('can update the component only when the cacheKey changes', function () {
        let updates = 0
        let componentRenders = 0
        let renders = 0

        function render () {
          renders++
          return vdomComponent(
            {
              cacheKey: model.cacheKey,
              onupdate () {
                updates++
              },
            },
            function () {
              componentRenders++
              return h('button', {onclick () {}}, 'refresh')
            },
          )
        }

        const model = {
          cacheKey: 1,
        }

        attach(render, model)

        expect(renders).to.equal(1)
        expect(componentRenders).to.equal(1)
        expect(updates).to.equal(0)

        return click('button').then(function () {
          return retry(function () {
            expect(renders).to.equal(2)
            expect(componentRenders).to.equal(1)
            expect(updates).to.equal(0)
          })
        }).then(function () {
          model.cacheKey++
          return click('button')
        }).then(function () {
          return retry(function () {
            expect(renders).to.equal(3)
            expect(componentRenders).to.equal(2)
            expect(updates).to.equal(1)
          })
        })
      })

      it('can wrap event handlers inside the component', function () {
        const events: any[] = []

        function render () {
          return h('div',
            vdomComponent(
              {
                on (type: string, handler: (...args: any[]) => void) {
                  return function (this: any) {
                    events.push('component ' + type)
                    return handler.apply(this, arguments)
                  }
                },
              },
              function () {
                return h('div',
                  vdomComponent(
                    {
                      on (type: string, handler: (...args: any[]) => void) {
                        return function (this: any) {
                          events.push('inner component ' + type)
                          return handler.apply(this, arguments)
                        }
                      },
                    },
                    function () {
                      return h(
                        'button.inner-inner-component',
                        {onclick () { events.push('inner inner click') }},
                        'click me',
                       )
                    },
                  ),
                  h('button.inner-component', {onclick () { events.push('inner click') }}, 'click me'),
                )
              },
            ),
            h('button.outer-component', {onclick () { events.push('outer click') }}, 'click me'),
          )
        }

        attach(render)

        return click('button.inner-component').then(function () {
          expect(events).to.eql(['component click', 'inner click'])
        }).then(function () {
          return click('button.inner-inner-component').then(function () {
            expect(events).to.eql(['component click', 'inner click', 'inner component click', 'inner inner click'])
          })
        }).then(function () {
          return click('button.outer-component').then(function () {
            expect(events).to.eql(
              ['component click', 'inner click', 'inner component click', 'inner inner click', 'outer click'],
            )
          })
        })
      })
    })

    describe('hyperdom.html.refreshAfter', function () {
      it('refreshes after the promise is complete', function () {
        let waiting: Promise<any>

        function load (model: {text: string}) {
          return waiting
            ? undefined
            : (waiting = wait(20).then(function () {
              model.text = 'loaded'
            }))
        }

        function render (model: {text: string}) {
          hyperdom.html.refreshAfter(load(model))

          return h('div', model.text)
        }

        attach(render, {text: 'loading'})

        return retry(function () {
          expect(find('div').text()).to.equal('loaded')
        })
      })
    })
  })
})

function wait (n: number) {
  return new Promise(function (resolve) {
    setTimeout(resolve, n)
  })
}

function contextInProduction (fn: () => void) {
  context('when NODE_ENV=production', function () {
    beforeEach(function () {
      process.env.NODE_ENV = 'production'
    })

    afterEach(function () {
      delete process.env.NODE_ENV
    })

    fn()
  })
}
