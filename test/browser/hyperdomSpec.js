/* eslint-env mocha */

require('lie/polyfill')

var $ = require('jquery')
var hyperdom = require('../..')
var router = require('../../router')
var mapBinding = require('../../mapBinding')
var h = hyperdom.html
var jsx = hyperdom.jsx
var expect = require('chai').expect
var retry = require('trytryagain')
require('jquery-sendkeys')
var browser = require('browser-monkey').find('.test')
var vdomToHtml = require('vdom-to-html')
var times = require('lowscore/times')
var range = require('lowscore/range')
var vdomComponent = require('../../componentWidget')
var windowEvents = require('../../windowEvents')
var merge = require('../../merge')
var runRender = require('../../render')
var Mount = require('../../mount')

var detect = {
  dataset: typeof document.body.dataset === 'object'
}

describe('hyperdom', function () {
  var div

  beforeEach(function () {
    $('.test').remove()
    div = $('<div class="test"/>').appendTo(document.body)[0]
  })

  function attach () {
    var args = Array.prototype.slice.call(arguments)
    args.unshift(div)
    args.push({
      requestRender: setTimeout
    })
    hyperdom.append.apply(hyperdom, args)
  }

  function find (selector) {
    return $(div).find(selector)
  }

  function click (selector) {
    return retry(function () {
      expect(find(selector).length).to.equal(1, "could not find button '" + selector + "'")
    }).then(function () {
      find(selector).click()
    })
  }

  function check (selector) {
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

      rendering: function () {
        this.renderCount++
      },

      waitForRender: function () {
        var self = this

        var oldRefreshCount = self.renderCount

        return this.wait(oldRefreshCount)
      },

      waitForRenderAfter: function (action) {
        var self = this

        var oldRefreshCount = self.renderCount

        return action.then(function () {
          return self.wait(oldRefreshCount)
        })
      },

      wait: function (oldRefreshCount) {
        var self = this

        return retry(function () {
          expect(self.renderCount, 'renderCount').to.equal(oldRefreshCount + 1)
        })
      }
    }
  }

  describe('attaching', function () {
    var targetDiv

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
      var model = {
        stuff: 'stuff',
        render: function () {
          return h('div.rendered', {onclick: function () {}}, this.stuff)
        }
      }

      var renderRequested = false

      hyperdom.append(targetDiv, model, {
        requestRender: function (render) {
          renderRequested = true
          setTimeout(render)
        }
      })

      expect(div.innerHTML).to.equal('<div><div class="rendered">stuff</div></div>')
      return click('div.rendered').then(function () {
        expect(renderRequested).to.equal(true)
      })
    })

    it('can pass a synchronous reqeustRender function', function () {
      var model = {
        count: 0,

        render: function () {
          var self = this
          return h('div',
            h('div.count', 'count: ' + this.count),
            h('button.add', {onclick: function () { self.count++ }}, '++')
          )
        }
      }

      hyperdom.append(targetDiv, model, {
        requestRender: function (render) {
          render()
        }
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

      var targetVDom = h('body')

      hyperdom.appendVDom(targetVDom, render)

      expect(vdomToHtml(targetVDom)).to.contain('<div class="rendered"></div>')
    })

    describe('server-side rendering', function () {
      var app
      var events

      beforeEach(function () {
        events = []

        app = {
          name: 'server render',

          render: function () {
            var self = this
            return h('div.static',
              h('h1', self.name),
              h('button.update',
                {
                  onclick: function () {
                    events.push('click')
                    self.name = 'client render'
                  }
                },
                'update'
              )
            )
          }
        }
      })

      it('can merge onto an existing DOM', function () {
        $(targetDiv).replaceWith(vdomToHtml(app.render()))

        var mergeDiv = div.children[0]

        merge(mergeDiv, app, {
          requestRender: setTimeout
        })

        return retry(function () {
          expect(find('button.update')[0].onclick).to.exist // eslint-disable-line no-unused-expressions
        }).then(function () {
          return click('button.update').then(function () {
          }).then(function () {
            return retry(function () {
              expect(find('h1').text()).to.equal('client render')
            })
          })
        })
      })

      it('updates client side with client-side changes', function () {
        $(targetDiv).replaceWith(vdomToHtml(app.render()))

        var mergeDiv = div.children[0]
        app.name = 'client render'
        merge(mergeDiv, app, {
          requestRender: setTimeout
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

      attach(render, {})

      expect(find('.haha').length).to.eql(1)
    })

    it('can render pound sign', function () {
      function render () {
        return h('div', '£')
      }

      attach(render, {})

      expect(find('div').text()).to.eql('£')
    })

    function itCanRenderA (type, value, expectedValue) {
      it('can render a ' + type, function () {
        function render () {
          return h('div.haha', value)
        }

        attach(render, {})

        expect(find('.haha').text()).to.eql(expectedValue !== undefined ? expectedValue : String(value))
      })
    }

    itCanRenderA('number', 4)
    itCanRenderA('boolean', true)
    itCanRenderA('date', new Date())
    itCanRenderA('undefined', undefined, '')

    it('can render an object', function () {
      function render () {
        return h('div.haha', 'object ', { name: 'asdf' })
      }

      attach(render, {})

      expect(find('.haha').text()).to.equal('object {"name":"asdf"}')
    })

    describe('class', function () {
      it('accepts a string', function () {
        function render () {
          return h('div.one', {class: 'two three'})
        }

        attach(render, {})

        expect(find('div').attr('class')).to.eql('one two three')
      })

      it('accepts an array of strings', function () {
        function render () {
          return h('div.one', {class: ['two', 'three']})
        }

        attach(render, {})

        expect(find('div').attr('class')).to.eql('one two three')
      })

      it('accepts an object', function () {
        function render () {
          return h('div.one', {class: {two: true, three: true, four: false}})
        }

        attach(render, {})

        expect(find('div').attr('class')).to.eql('one two three')
      })

      it('accepts an array with a mix of strings and objects', function () {
        function render () {
          return h('div.one', {class: ['two', ['three', {four: true, five: false}], {six: true, seven: false, eight: true}]})
        }

        attach(render, {})

        expect(find('div').attr('class')).to.eql('one two three four six eight')
      })
    })

    describe('selectors', function () {
      function selectorProduces (selector, expectedSelector) {
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
      it('can render a for attribute', function () {
        function render () {
          return h('div',
              h('label', {for: 'blah'})
            )
        }

        attach(render, {text: 'one'})

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
              return h('div', {'data-one': 'one', 'data-two': 'two', dataset: {three: 'three'}})
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
                attributes: { autocapitalize: 'none', autofocus: true }
              })
            )
        }

        attach(render, {})

        expect(find('input').attr('autocapitalize')).to.equal('none')
        expect(find('input').attr('autofocus')).to.equal('autofocus')
      })
    })

    describe('raw unescaped HTML', function () {
      it('can render raw HTML', function () {
        function render (model) {
          return h('div',
            model.text
              ? hyperdom.rawHtml('p', 'some <strong>dangerous HTML (' + model.text + ')')
              : undefined,
            h('button.two', {onclick: function () { model.text = 'two' }}),
            h('button.three', {onclick: function () { model.text = '' }})
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
            hyperdom.rawHtml('p.raw', {style: {color: 'red'}}, 'some <strong>dangerous HTML')
          )
        }

        attach(render, {text: 'one'})

        var p = find('p')
        expect(p.html()).to.eql('some <strong>dangerous HTML</strong>')
        expect(p.attr('class')).to.eql('raw')
        expect(p.attr('style')).to.eql('color: red;')
      })

      it('updates the dom when the HTML changes', function () {
        function render (model) {
          return h('div',
            hyperdom.rawHtml('p.raw', model.html),
            h('p.x', model.x),
            h('button.one', {onclick: function () { model.x = 'zzz' }}),
            h('button.two', {onclick: function () { model.html = 'Nice <b>HTML</b>' }})
          )
        }

        attach(render, {html: 'Naughty <b>HTML</b>', x: 'yyy'})

        expect(find('p.raw').html()).to.equal('Naughty <b>HTML</b>')

        var b = find('p.raw b')[0]

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
        var app = {
          render: function () {
            throw new Error('oops')
          }
        }

        expect(function () {
          attach(app)
        }).to.throw('oops')
      })

      it('no change to HTML if there is a rendering error', function () {
        var error

        var app = {
          render: function () {
            if (error) {
              throw error
            } else {
              return h('h1', 'first render')
            }
          }
        }

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
          jsx('div', {class: 'two'}, ['text'])
        ])
      }

      attach(render, {})

      expect(find('div.one').attr('class')).to.eql('one')
      expect(find('div.one > div.two').text()).to.eql('text')
    })

    it('renders view components', function () {
      function CoolButton (properties, children) {
        this.properties = properties
        this.children = children
      }

      CoolButton.prototype.render = function () {
        return h('button', h('span.title', this.properties.title), this.children)
      }

      var app = {
        render: function () {
          return h('div', jsx(CoolButton, {title: 'button title'}, h('h1', 'contents')))
        }
      }

      attach(app)

      expect(find('div button span.title').text()).to.equal('button title')
    })

    it('renders svg classes', function () {
      function render () {
        return jsx('svg', {xmlns: 'http://www.w3.org/2000/svg', width: '300', height: '300'}, [
          jsx('circle', {class: 'svg-circle'})
        ])
      }

      attach(render, {})

      expect(find('.svg-circle').length).to.eql(1)
    })

    it('renders view components without attributes', function () {
      function CoolButton (properties, children) {
        this.properties = properties
        this.children = children
      }

      CoolButton.prototype.render = function () {
        return h('button', h('span.title', this.properties.title || 'no title'), this.children)
      }

      var app = {
        render: function () {
          return h('div', jsx(CoolButton, undefined, h('h1', 'another cool button')))
        }
      }

      attach(app)

      expect(find('div button span.title').text()).to.equal('no title')
    })
  })

  describe('xml', function () {
    it('renders xml element all children with namespace specified with xmlns', function () {
      function render () {
        return jsx('svg', {xmlns: 'http://www.w3.org/2000/svg', width: '300', height: '300'}, [
          jsx('circle', {cx: '50', cy: '50', r: '40', stroke: 'red', 'stroke-width': '4', fill: 'yellow'})
        ])
      }

      attach(render, {})

      expect(find('svg')[0].namespaceURI).to.eql('http://www.w3.org/2000/svg')
      expect(find('svg>circle')[0].namespaceURI).to.eql('http://www.w3.org/2000/svg')
    })

    it('renders tags with namespaces', function () {
      function render () {
        return jsx('data', {xmlns: 'urn:data', 'xmlns--addr': 'urn:address'}, [
          jsx('addr--address', {name: 'bob', 'addr--street': 'ny st'})
        ])
      }

      attach(render, {})

      expect(find('data')[0].namespaceURI).to.eql('urn:data')
      var address = find('data>address')[0]
      expect(address.namespaceURI).to.eql('urn:address')
      expect(address.prefix).to.eql('addr')
      var addressAttribute = address.getAttributeNodeNS('urn:address', 'street')
      expect(addressAttribute.namespaceURI).to.eql('urn:address')
      expect(addressAttribute.name).to.eql('addr:street')
      expect(addressAttribute.prefix).to.eql('addr')
      expect(addressAttribute.localName).to.eql('street')
      expect(addressAttribute.value).to.eql('ny st')
      expect(address.getAttribute('name')).to.eql('bob')
    })

    it('inner element can declare new default namespace', function () {
      function render () {
        return jsx('data', {xmlns: 'urn:data'}, [
          jsx('address', {name: 'bob', xmlns: 'urn:address', 'xmlns--addr': 'urn:address', 'addr--street': 'ny st'})
        ])
      }

      attach(render, {})

      expect(find('data')[0].namespaceURI).to.eql('urn:data')
      var address = find('data>address')[0]
      expect(address.namespaceURI).to.eql('urn:address')
      expect(address.prefix).to.eql(null)
      var addressAttribute = address.getAttributeNodeNS('urn:address', 'street')
      expect(addressAttribute).to.exist // eslint-disable-line no-unused-expressions
      expect(addressAttribute.namespaceURI).to.eql('urn:address')
      expect(addressAttribute.name).to.eql('addr:street')
      expect(addressAttribute.prefix).to.eql('addr')
      expect(addressAttribute.localName).to.eql('street')
      expect(addressAttribute.value).to.eql('ny st')
      expect(address.getAttribute('name')).to.eql('bob')
    })
  })

  describe('event handlers', function () {
    it('can respond to button clicks', function () {
      function render (model) {
        return h('div',
          h('button', {
            onclick: function () {
              model.on = true
            }
          }),
          model.on ? h('span', 'on') : undefined
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
      function render (model) {
        return h('div',
          h('button', {
            onclick: function () {
              model.text = 'loading'
              return new Promise(function (resolve) {
                setTimeout(function () {
                  model.text = 'loaded'
                  resolve()
                }, 100)
              })
            }
          }),
          h('span', model.text)
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

    it('can define event handlers outside of the render loop', function () {
      var model = {
        button: h('button', {
          onclick: function () {
            model.on = true
          }
        }),

        render: function () {
          return h('div',
            this.button,
            model.on ? h('span', 'on') : undefined
          )
        }
      }

      attach(model)

      return click('button').then(function () {
        return retry(function () {
          expect(find('span').text()).to.eql('on')
        })
      })
    })

    it('can render components outside of the render loop', function () {
      var model = {
        button: h('div',
          {
            render: function () {
              return h('button', {
                onclick: function () {
                  model.on = true
                }
              })
            }
          }
        ),

        render: function () {
          return h('div',
            this.button,
            model.on ? h('span', 'on') : undefined
          )
        }
      }

      attach(model)

      return click('button').then(function () {
        return retry(function () {
          expect(find('span').text()).to.eql('on')
        })
      })
    })

    it('can render bindings outside of the render loop', function () {
      var model = {
        text: '',

        render: function () {
          return h('div',
            this.input,
            h('span', model.text)
          )
        }
      }

      model.input = h('input', {binding: [model, 'text'], type: 'text'})

      attach(model)
      find('input').sendkeys('haha')

      return retry(function () {
        expect(find('span').text()).to.eql('haha')
      })
    })
  })

  describe('norefresh', function () {
    it("when returned the view doesn't refresh after the handler has run", function () {
      var refreshes = 0
      function render () {
        refreshes++

        return h('div',
          h('button.refresh', {
            onclick: function () {
            }
          }),
          h('button.norefresh', {
            onclick: function () {
              return hyperdom.norefresh()
            }
          }),
          h('span', refreshes)
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
      function render (model) {
        return h('div',
          h('input', {type: 'text', binding: [model, 'text']}),
          h('span', model.text)
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
        function render (model) {
          return h('div',
            !model.hide1
              ? h('label', h('input.one', {type: 'checkbox', binding: [model, 'hide1']}), 'hide one')
              : undefined,
            !model.hide2
              ? h('label', h('input.two', {type: 'checkbox', binding: [model, 'hide2']}), 'hide two')
              : undefined
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
        function render (model) {
          return h('div',
            model.value === 1 ? h('h1', 'selected one') : undefined,
            h('label', h('input.one', {type: 'radio', name: 'thingy', binding: [model, 'value'], value: 1, id: 'one'}), 'one'),
            h('label', h('input.two', {type: 'radio', name: 'thingy', binding: [model, 'value'], value: 2, id: 'two'}), 'two')
          )
        }

        attach(render, {value: 1})

        return check('.two').then(function () {
          return retry(function () {
            expect(find('h1').length).to.equal(0)
            expect(find('input.one')[0].checked).to.equal(false)
            expect(find('input.two')[0].checked).to.equal(true)
          })
        })
      })
    })

    describe('binding options', function () {
      it('can bind with set conversion', function () {
        var numberConversion = {
          model: function (view) {
            return Number(view)
          },

          view: function (model) {
            return String(model)
          }
        }

        function render (model) {
          return h('div',
            h('input', {type: 'text', binding: mapBinding(model, 'number', numberConversion)}),
            h('span', model.number)
          )
        }

        var model = {number: 0}
        attach(render, model)

        find('input').sendkeys('{selectall}{backspace}123')

        return retry(function () {
          expect(find('span').text()).to.equal('123')
          expect(find('input').val()).to.equal('123')
          expect(model.number).to.equal(123)
        })
      })

      it("doesn't set the input text if the value is an Error", function () {
        function number (value) {
          var n = Number(value)
          if (isNaN(n)) {
            return new Error('expected a number')
          } else {
            return n
          }
        }

        function render (model) {
          return h('div',
            h('input', {type: 'text', binding: mapBinding(model, 'number', number)}),
            h('span', model.number)
          )
        }

        var model = {number: 0}
        attach(render, model)

        find('input').sendkeys('{selectall}{backspace}abc')

        return retry(function () {
          expect(find('span').text()).to.equal('Error: expected a number')
          expect(find('input').val()).to.equal('abc')
          expect(model.number).to.be.instanceof(Error)
        }).then(function () {
          find('input').sendkeys('{selectall}{backspace}123')
        }).then(function () {
          return retry(function () {
            expect(find('span').text()).to.equal('123')
            expect(find('input').val()).to.equal('123')
            expect(model.number).to.equal(123)
          })
        })
      })
    })

    it('when model returns undefined, it clears the input', function () {
      function render (model) {
        return h('div',
          h('input', {type: 'text', binding: [model, 'text']}),
          h('button.clear', {onclick: function () { delete model.text }}, 'clear'),
          h('span', model.text)
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
      function render (model) {
        return h('div',
          h('input', {
            type: 'text',
            binding: [model, 'tempText'],
            oninput: function () {
              model.text = model.tempText
            }
          }),
          h('span', model.text)
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
      function render (model) {
        return h('div',
          h('textarea', {binding: [model, 'text']}),
          h('span', model.text)
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
      function render (model) {
        return h('div',
          h('input', {type: 'checkbox', binding: [model, 'check']}),
          h('span', model.check ? 'on' : 'off')
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
      var blue = { name: 'blue' }

      function render (model) {
        return h('div',
          h('input.red', {
            type: 'radio',
            name: 'colour',
            binding: [model, 'colour'],
            value: 'red'
          }),
          h('input.blue', {
            type: 'radio',
            name: 'colour',
            binding: [model, 'colour'],
            value: blue
          }),
          h('span', JSON.stringify(model.colour))
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
        var blue = { name: 'blue' }

        var app = {
          colour: blue,

          render: function () {
            return h('div',
              h('select',
                {binding: [this, 'colour']},
                h('option.red', {value: 'red'}, 'red'),
                h('option.blue', {value: blue}, 'blue')
              ),
              h('span', JSON.stringify(this.colour))
            )
          }
        }

        attach(app)

        return retry(function () {
          expect(find('span').text()).to.equal('{"name":"blue"}')
          expect(find('option.red').prop('selected')).to.equal(false)
          expect(find('option.blue').prop('selected')).to.equal(true)
        }).then(function () {
          find('select')[0].selectedIndex = 0
          find('select').change()

          return retry(function () {
            expect(find('span').text()).to.equal('"red"')
            expect(find('option.red').prop('selected')).to.equal(true)
          }).then(function () {
            find('select')[0].selectedIndex = 1
            find('select').change()

            return retry(function () {
              expect(find('span').text()).to.equal('{"name":"blue"}')
              expect(find('option.blue').prop('selected')).to.equal(true)
            })
          })
        })
      })

      it('can render select with text nodes', function () {
        var app = {
          colour: 'red',

          render: function () {
            return h('div',
              h('select',
                {binding: [this, 'colour']},
                h('option.red', {value: 'red'}, 'red'),
                ''
              ),
              h('span', JSON.stringify(this.colour))
            )
          }
        }

        attach(app)

        return retry(function () {
          expect(find('span').text()).to.equal('"red"')
          expect(find('option.red').prop('selected')).to.equal(true)
        })
      })

      it('can set select values', function () {
        attach(render)
        function render (model) {
          return h('select',
            {binding: [model, 'colour']},
            h('option.red', {value: 'red'}, 'red')
          )
        }
        return retry(function () {
          expect(find('option.red').prop('value')).to.equal('red')
        })
      })

      it('can bind to select with no values on its options', function () {
        var app = {
          colour: 'blue',

          render: function () {
            return h('div',
              h('select',
                {binding: [this, 'colour']},
                h('option.red', 're', 'd'),
                h('option.orange'),
                h('option.green', {value: 'green (not blue, ignore me)'}, 'blue'),
                h('option.blue', 'bl', 'ue')
              ),
              h('span', JSON.stringify(this.colour))
            )
          }
        }

        attach(app)

        return retry(function () {
          expect(find('span').text()).to.equal('"blue"')
          expect(find('option.red').prop('selected')).to.equal(false)
          expect(find('option.blue').prop('selected')).to.equal(true)
        }).then(function () {
          find('select')[0].selectedIndex = 0
          find('select').change()

          return retry(function () {
            expect(find('span').text()).to.equal('"red"')
            expect(find('option.red').prop('selected')).to.equal(true)
          }).then(function () {
            find('select')[0].selectedIndex = 3
            find('select').change()

            return retry(function () {
              expect(find('span').text()).to.equal('"blue"')
              expect(find('option.blue').prop('selected')).to.equal(true)
            })
          })
        })
      })

      it('chooses the first if nothing is selected', function () {
        var app = {
          render: function () {
            return h('div',
              h('select',
                {binding: [this, 'colour']},
                h('option.red', 're', 'd'),
                h('option.orange'),
                h('option.green', {value: 'green (not blue, ignore me)'}, 'blue'),
                h('option.blue', 'bl', 'ue')
              ),
              h('span', JSON.stringify(this.colour))
            )
          }
        }

        attach(app)

        return retry(function () {
          expect(find('option.red').prop('selected')).to.equal(true)
          expect(find('select')[0].selectedIndex).to.equal(0)
        })
      })
    })
  })

  describe('components', function () {
    it('calls onload once when HTML appears on page', function () {
      var model = {
        loaded: 0,
        refreshed: 0,

        onload: function () {
          var self = this
          return wait(20).then(function () {
            self.loaded++
          })
        },

        render: function () {
          this.refreshed++
          return h('div',
            h('h1.loaded', 'loaded ' + this.loaded + ' times'),
            h('h1.refreshed', 'refreshed ' + this.refreshed + ' times'),
            h('button.refresh', {onclick: function () {}}, 'refresh')
          )
        }
      }

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
        var model = {
          innerModel: {
            loaded: 0,
            refreshed: 0,

            onload: function () {
              var self = this
              return wait(20).then(function () {
                self.loaded++
              })
            },

            render: function () {
              this.refreshed++
              return h('div',
                h('h1.loaded', 'loaded ' + this.loaded + ' times'),
                h('h1.refreshed', 'refreshed ' + this.refreshed + ' times'),
                h('button.refresh', {onclick: function () {}}, 'refresh')
              )
            }
          },

          render: function () {
            return h('div.outer', this.innerModel)
          }
        }

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
      var events = []
      var monitor = renderMonitor()

      var model = {
        showComponent: true,

        innerModel: {
          onadd: function (element) {
            events.push({
              type: 'onadd',
              parent: element.parentNode,
              element: element
            })
          },

          onupdate: function (element) {
            events.push({
              type: 'onupdate',
              element: element
            })
          },

          onremove: function (element) {
            events.push({
              type: 'onremove',
              element: element
            })
          },

          render: function () {
            return h('h1', 'component')
          }
        },

        render: function () {
          monitor.rendering()

          return h('div',
            this.showComponent ? this.innerModel : undefined,
            h('button.refresh', {onclick: function () {}}, 'refresh'),
            h('button.remove', {onclick: function () { model.showComponent = false }}, 'remove')
          )
        }
      }

      attach(model)

      var expectedParent = div.firstChild
      var expectedElement = div.firstChild.firstChild

      return monitor.waitForRenderAfter(click('button.refresh')).then(function () {
        return monitor.waitForRenderAfter(click('button.refresh'))
      }).then(function () {
        return monitor.waitForRenderAfter(click('button.remove'))
      }).then(function () {
        expect(events).to.eql([
          {
            type: 'onadd',
            parent: expectedParent,
            element: expectedElement
          },
          {
            type: 'onupdate',
            element: expectedElement
          },
          {
            type: 'onupdate',
            element: expectedElement
          },
          {
            type: 'onremove',
            element: expectedElement
          }
        ])
      })
    })

    it('top level receives onadd, onupdate and onremove events after the DOM changes have been made', function () {
      var events = []
      var monitor = renderMonitor()

      var model = {
        onadd: function (element) {
          events.push({
            type: 'onadd',
            parent: element.parentNode,
            element: element
          })
        },

        onupdate: function (element) {
          events.push({
            type: 'onupdate',
            element: element
          })
        },

        render: function () {
          monitor.rendering()

          return h('div',
            h('h1', 'component'),
            h('button.refresh', { onclick: function () {} }, 'refresh')
          )
        }
      }

      attach(model)

      var expectedParent = div
      var expectedElement = div.firstChild

      return monitor.waitForRenderAfter(click('button.refresh')).then(function () {
        return monitor.waitForRenderAfter(click('button.refresh'))
      }).then(function () {
        expect(events).to.eql([
          {
            type: 'onadd',
            parent: expectedParent,
            element: expectedElement
          },
          {
            type: 'onupdate',
            element: expectedElement
          },
          {
            type: 'onupdate',
            element: expectedElement
          }
        ])
      })
    })

    it('calls onadd when a component of a different constructor rendered', function () {
      var events = []
      var monitor = renderMonitor()

      function ComponentA () {
        this.text = 'A'
      }

      ComponentA.prototype.onadd = function () {
        events.push('onadd a')
      }

      ComponentA.prototype.render = function () {
        return h('h1', this.text)
      }

      function ComponentB () {
        this.text = 'B'
      }

      ComponentB.prototype.onadd = function () {
        events.push('onadd b')
      }

      ComponentB.prototype.render = function () {
        return h('h1', this.text)
      }

      var model = {
        showComponentA: true,

        render: function () {
          monitor.rendering()

          return h('div',
            this.showComponentA ? new ComponentA() : new ComponentB(),
            h('input.swap', {type: 'checkbox', binding: [this, 'showComponentA']})
          )
        }
      }

      attach(model)

      expect(events).to.eql([
        'onadd a'
      ])

      return monitor.waitForRenderAfter(click('input.swap')).then(function () {
        expect(events).to.eql([
          'onadd a',
          'onadd b'
        ])
        return monitor.waitForRenderAfter(click('input.swap'))
      }).then(function () {
        expect(events).to.eql([
          'onadd a',
          'onadd b',
          'onadd a'
        ])
        return monitor.waitForRenderAfter(click('input.swap'))
      })
    })

    it('calls onadd when a component of with a different key is rendered', function () {
      var events = []
      var monitor = renderMonitor()

      function Component (key) {
        this.debug = true
        this.renderKey = key
        this.text = key || 'a'
      }

      Component.prototype.onadd = function () {
        events.push('onadd ' + this.text)
      }

      Component.prototype.render = function () {
        return h('h1', this.text)
      }

      var model = {
        showComponentA: true,

        render: function () {
          monitor.rendering()

          return h('div',
            new Component(this.showComponentA ? undefined : 'b'),
            h('input.swap', {type: 'checkbox', binding: [this, 'showComponentA']})
          )
        }
      }

      attach(model)

      expect(events).to.eql([
        'onadd a'
      ])

      return monitor.waitForRenderAfter(click('input.swap')).then(function () {
        expect(events).to.eql([
          'onadd a',
          'onadd b'
        ])
        return monitor.waitForRenderAfter(click('input.swap'))
      }).then(function () {
        expect(events).to.eql([
          'onadd a',
          'onadd b',
          'onadd a'
        ])
        return monitor.waitForRenderAfter(click('input.swap'))
      })
    })

    describe('caching', function () {
      it('can update the component only when the renderKey changes', function () {
        var innerRenders = 0
        var renders = 0

        var model = {
          innerModel: {
            cacheKey: 1,

            renderCacheKey: function () {
              return this.cacheKey
            },

            render: function () {
              innerRenders++
              return h('button', {onclick: function () {}}, 'refresh')
            }
          },

          render: function () {
            renders++
            return this.innerModel
          }
        }

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
        var innerRenders = 0
        var renders = 0

        var model = {
          innerModel: {
            renderCacheKey: function () {},

            render: function () {
              innerRenders++
              return h('button', {onclick: function () {}}, 'refresh')
            }
          },

          render: function () {
            renders++
            return this.innerModel
          }
        }

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
      var model = {
        name: 'Njord',

        render: function () {
          return h('h1', 'hi ' + this.name)
        }
      }

      attach(model)

      expect(find('h1').text()).to.equal('hi Njord')

      model.name = 'Hayfa'
      model.refresh()

      return retry(function () {
        expect(find('h1').text()).to.equal('hi Hayfa')
      })
    })

    it('can refresh several components without refreshing the whole page', function () {
      var model = {
        model1: innerModel('model1', 'one'),
        model2: innerModel('model2', 'xxx'),

        render: function () {
          return h('div', this.model1, this.model2)
        }
      }

      function innerModel (class_, name) {
        return {
          name: name,

          render: function () {
            return h('h1' + '.' + class_, 'hi ' + this.name)
          }
        }
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
      var model = {
        showModel: 1,

        model1: innerModel('one'),
        model2: innerModel('two'),

        render: function () {
          return h('div', this.showModel === 1 ? this.model1 : this.model2)
        }
      }

      function innerModel (name) {
        return {
          name: name,

          render: function () {
            return h('h1', 'hi ' + this.name)
          }
        }
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
      var model = {
        models: 1,

        innerModel: {
          name: 'Jack',

          render: function () {
            return h('li', this.name)
          }
        },

        render: function () {
          var self = this

          return h('ul', times(this.models, function () {
            return self.innerModel
          }))
        }
      }

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
  })

  describe('hyperdom.binding', function () {
    describe('validation', function () {
      it('throws if a string is passed', function () {
        expect(function () {
          hyperdom.binding('asdf')
        }).to.throw(/bindings must be.*or an object.*asdf/)
      })
    })
  })

  describe('hyperdom.refreshify', function () {
    this.timeout(2000)
    var refreshCalled

    beforeEach(function () {
      refreshCalled = false
      var mount = new Mount()

      runRender._currentRender = {
        mount: {
          refresh: function () {
            refreshCalled = true
          },

          requestRender: function (fn) {
            fn()
          },

          refreshify: function (fn, options) {
            return mount.refreshify.call(this, fn, options)
          }
        }
      }
    })

    function expectToRefresh (options, v) {
      (hyperdom.refreshify(function () {}, options))()
      expect(refreshCalled).to.equal(v)
    }

    function expectPromiseToRefreshWithOptions (options, expectations) {
      var fn = hyperdom.refreshify(function () {
        return wait(10)
      }, options)

      return expectPromiseToRefreshWithBinding(fn, expectations)
    }

    function expectPromiseToRefreshWithBinding (fn, expectations) {
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
        var component = {
          canRefresh: true,
          refresh: function () {
            this.wasRefreshed = true
          }
        };

        (hyperdom.refreshify(function () {}, {component: component}))()
        expect(component.wasRefreshed).to.equal(true)
      })
    })

    context('component: component', function () {
      it('calls refresh with the component', function () {
        var component = {
          refreshComponent: function () {
            this.wasRefreshed = true
          }
        };

        (hyperdom.refreshify(function () {}, {component: component}))()
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
      var integer = {
        view: function (model) {
          return (model || '').toString()
        },
        model: function (view) {
          if (!/^\d+$/.test(view)) { throw new Error('Must be an integer') }
          return Number(view)
        }
      }
      function render (model) {
        return h('div',
          h('input.x', {binding: mapBinding(model, 'x', integer)})
        )
      }
      var model = {}
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
    var events
    var monitor
    var renderData
    var renderCacheKey

    beforeEach(function () {
      monitor = renderMonitor()
      events = []

      renderData = 'one'
      renderCacheKey = 'one'
    })

    function trimH1 (innerHTML) {
      return /<h1>.*?<\/h1>/.exec(innerHTML)[0]
    }

    function component (options) {
      var render = typeof options === 'object' && options.hasOwnProperty('render') ? options.render : undefined

      return {
        onload: function () {
          events.push(['onload'])
          this.state = 'state'
        },

        onbeforeadd: function () {
          events.push(['onbeforeadd', this.state])
        },

        onadd: function (element) {
          events.push(['onadd', trimH1(element.innerHTML), this.state])
        },

        onbeforerender: function (element) {
          events.push(['onbeforerender', element ? trimH1(element.innerHTML) : null, this.state])
        },

        onrender: function (element, oldElement) {
          events.push(['onrender', trimH1(element.innerHTML), oldElement ? trimH1(oldElement.innerHTML) : null, this.state])
        },

        onbeforeupdate: function (element) {
          events.push(['onbeforeupdate', trimH1(element.innerHTML), this.state])
        },

        onupdate: function (element, oldElement) {
          events.push(['onupdate', trimH1(element.innerHTML), trimH1(oldElement.innerHTML), this.state])
        },

        onbeforeremove: function (element) {
          events.push(['onbeforeremove', trimH1(element.innerHTML), this.state])
        },

        onremove: function (element) {
          events.push(['onremove', trimH1(element.innerHTML), this.state])
        },

        render: function () {
          return h('div', h('h1', 'element: ' + monitor.renderCount), render ? render() : '')
        }
      }
    }

    function cachingComponent (render) {
      return {
        onload: function () {
          events.push('onload')
          this.lastState = 'load'
        },

        onbeforeadd: function () {
          events.push('onbeforeadd')
          this.lastState = 'beforeadd'
        },

        onadd: function (element) {
          events.push('onadd')
          this.lastState = 'add'
        },

        onbeforerender: function (element) {
          events.push('onbeforerender')
        },

        onrender: function (element, oldElement) {
          events.push('onrender')
        },

        onbeforeupdate: function (element) {
          events.push('onbeforeupdate')
          this.lastState = 'beforeupdate'
        },

        onupdate: function (element, oldElement) {
          events.push('onupdate')
          this.lastState = 'update'
        },

        onbeforeremove: function (element) {
          events.push('onbeforeremove')
          this.lastState = 'beforeremove'
        },

        onremove: function (element) {
          events.push('onremove')
          this.lastState = 'remove'
        },

        renderCacheKey: function () {
          monitor.rendering()
          return renderCacheKey
        },

        render: function () {
          return h('div',
            h('h1', 'element: ' + renderData),
            render ? render() : ''
          )
        }
      }
    }

    function respondsToEvents (options) {
      function elementHtml () {
        return '<h1>element: ' + (monitor.renderCount - renderOffset) + '</h1>'
      }

      function oldElementHtml () {
        return '<h1>element: ' + (monitor.renderCount - renderOffset - 1) + '</h1>'
      }

      var clickAdd
      var renderOffset

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
          ['onrender', elementHtml(), null, 'state']
        ])
        events = []

        return monitor.waitForRenderAfter(click('button.update'))
      }).then(function () {
        expect(events).to.eql([
          ['onbeforeupdate', oldElementHtml(), 'state'],
          ['onbeforerender', oldElementHtml(), 'state'],
          ['onupdate', elementHtml(), elementHtml(), 'state'],
          ['onrender', elementHtml(), elementHtml(), 'state']
        ])
        events = []

        if (!(options && options.remove === false)) {
          return monitor.waitForRenderAfter(click('button.remove')).then(function () {
            expect(events).to.eql([
              ['onbeforeremove', oldElementHtml(), 'state'],
              ['onremove', oldElementHtml(), 'state']
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
        'onrender'
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
          'onrender'
        ])
        events = []
      })
    }

    context('model components', function () {
      it('captures lifetime events', function () {
        var model = {
          show: false,

          innerModel: component(),

          render: function () {
            monitor.rendering()

            this.innerModel.data = monitor.renderCount

            return h('div',
              this.show ? this.innerModel : undefined,
              h('button.add', {onclick: function () { model.show = true }}, 'add'),
              h('button.update', {onclick: function () {}}, 'update'),
              h('button.remove', {onclick: function () { model.show = false }}, 'remove')
            )
          }
        }

        attach(model)

        return respondsToEvents()
      })

      it('can cache', function () {
        var app = {
          innerModel: cachingComponent(),

          render: function () {
            return h('div',
              this.innerModel,
              h('button.update', {onclick: function () {}}, 'update')
            )
          }
        }

        attach(app)

        return canCache()
      })
    })

    context('top level model components', function () {
      it('captures lifetime events', function () {
        var model = component({
          render: function () {
            monitor.rendering()
            return h('div',
              h('button.add', {onclick: function () { model.show = true }}, 'add'),
              h('button.update', {onclick: function () {}}, 'update')
            )
          }
        })

        attach(model)

        return respondsToEvents({remove: false})
      })

      it('can cache', function () {
        var app = cachingComponent(function () {
          return h('button.update', {onclick: function () {}}, 'update')
        })

        attach(app)

        return canCache()
      })
    })

    context('view components', function () {
      it('captures lifetime events', function () {
        var app = {
          render: function () {
            monitor.rendering()
            return h('div',
              this.show
                ? hyperdom.viewComponent(component())
                : undefined,
              h('button.add', {onclick: function () { app.show = true }}, 'add'),
              h('button.remove', {onclick: function () { app.show = false }}, 'remove'),
              h('button.update', {onclick: function () {}}, 'update')
            )
          }
        }

        attach(app)

        return respondsToEvents()
      })

      it('can cache', function () {
        var app = {
          render: function () {
            return h('div',
              hyperdom.viewComponent(cachingComponent()),
              h('button.update', {onclick: function () {}}, 'update')
            )
          }
        }

        attach(app)

        return canCache()
      })
    })
  })

  describe('component debugger', function () {
    contextInProduction(function () {
      it('does not set debugging properties', function () {
        var inner = {
          render: function () {
            return h('div.inner', 'inner')
          }
        }

        var outer = {
          render: function () {
            return h('div.outer', 'outer', inner)
          }
        }

        attach(outer)

        expect(find('.outer')[0]._hyperdomMeta).to.eql(undefined)
        expect(find('.inner')[0]._hyperdomMeta).to.eql(undefined)
      })
    })

    it('sets the component to the element', function () {
      var inner = {
        render: function () {
          return h('div.inner', 'inner')
        }
      }

      var outer = {
        render: function () {
          return h('div.outer', 'outer', inner)
        }
      }

      attach(outer)

      expect(find('.outer')[0]._hyperdomMeta.component).to.eql(outer)
      expect(find('.inner')[0]._hyperdomMeta.component).to.eql(inner)
    })

    afterEach(function () {
      router.reset()
    })

    it('an application with routes sets the component to the element', function () {
      var inner = {
        render: function () {
          return h('div.inner', 'inner')
        }
      }

      var home = router.route('**')

      var outer = {
        routes: function () {
          return [
            home({
              render: function () {
                return h('div.outer', 'outer', inner)
              }
            })
          ]
        }
      }

      hyperdom.append(div, outer, {router: router})

      expect(find('.outer')[0]._hyperdomMeta.component).to.eql(outer)
      expect(find('.inner')[0]._hyperdomMeta.component).to.eql(inner)
    })

    it('an application with routes sets the component to the element', function () {
      var inner = {
        render: function () {
          return h('div.inner', 'inner')
        }
      }

      var home = router.route('**')

      var outer = {
        routes: function () {
          return [
            home({
              render: function () {
                return inner
              }
            })
          ]
        },

        renderLayout: function (content) {
          return h('div.outer', 'outer', content)
        }
      }

      hyperdom.append(div, outer, {router: router})

      expect(find('.outer')[0]._hyperdomMeta.component).to.eql(outer)
      expect(find('.inner')[0]._hyperdomMeta.component).to.eql(inner)
    })
  })

  describe('keys', function () {
    it('keeps HTML elements for same keys', function () {
      var items = range(1, 11)
      var app = {
        render: function () {
          return h('div', items.map(function (item) {
            return h('div.item', {key: item}, item)
          }))
        }
      }

      attach(app)

      return browser.find('div.item').shouldHave({
        text: items.map(function (item) {
          return String(item)
        })
      }).then(function () {
        var two = document.querySelector('div.item:nth-child(2)')
        items.shift()
        app.refresh()
        return browser.find('div.item').shouldHave({
          text: items.map(function (item) {
            return String(item)
          })
        }).then(function () {
          expect(two.innerText).to.equal('2')
        })
      })
    })
  })

  describe('v1 compatibility', function () {
    describe('hyperdom.html.refresh', function () {
      it('refreshes the UI when called', function () {
        function render (model) {
          var refresh = h.refresh

          return h('div',
            h('h1', model.text),
            h('button.refresh', {
              onclick: function () {
                setTimeout(function () {
                  model.text = 'after timeout'
                  refresh()
                }, 50)
              }
            },
            'refresh')
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
        function render (model) {
          var refresh = h.refresh
          var component = vdomComponent(function () { return h('h2', model.text) })

          return h('div',
            h('h1', model.text),
            component,
            h('button.refresh', {
              onclick: function () {
                setTimeout(function () {
                  model.text = 'after timeout'
                  refresh(component)
                }, 50)
              }
            },
            'refresh')
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
        var monitor = renderMonitor()
        var updated = 0
        var rendered = 0

        function render (model) {
          var refresh = h.refresh
          monitor.rendering()

          var component = vdomComponent(
            {
              cacheKey: true,
              onupdate: function () {
                updated++
              }
            },
            function () {
              rendered++
              return h('h2', model.text)
            }
          )

          return h('div',
            component,
            h('button.refresh', {
              onclick: function () {
                monitor.waitForRender().then(function () {
                  refresh(component)
                })
              }
            },
            'refresh')
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
        function render (model) {
          var refresh = h.refresh

          return h('div',
            h('h1', model.text),
            h('button.refresh', {
              onclick: function () {
                setTimeout(function () {
                  model.text = 'after timeout'
                  refresh({})
                }, 50)
              }
            },
            'refresh')
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
        function render (model) {
          var refresh = h.refresh

          return h('div',
            h('h1', model.text),
            h('button.refresh', {
              onclick: function () {
                setTimeout(function () {
                  try {
                    model.text = 'after timeout'
                    h.refresh()
                  } catch (e) {
                    model.text = e.message
                    refresh()
                  }
                }, 50)
              }
            },
            'refresh')
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
        function render (model) {
          return h('div',
            model.active
              ? windowEvents(
                {
                  onclick: function () {
                    model.clicks++
                  }
                }
                )
              : undefined,
            model.active
              ? h('button.disactivate', {onclick: function () { model.active = false; return false }}, 'disactivate')
              : h('button.activate', {onclick: function () { model.active = true; return false }}, 'activate'),
            h('div.click', 'click here'),
            h('div.clicks', model.clicks)
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
        var events = []
        var componentState
        var monitor = renderMonitor()

        function render (model) {
          monitor.rendering()

          return h('div',
            model.showComponent
              ? vdomComponent({
                onadd: function (element) {
                  events.push({
                    type: 'onadd',
                    parent: element.parentNode,
                    element: element
                  })
                  componentState = this
                },
                onupdate: function (element) {
                  events.push({
                    type: 'onupdate',
                    element: element,
                    state: this
                  })
                },
                onremove: function (element) {
                  events.push({
                    type: 'onremove',
                    element: element,
                    state: this
                  })
                }
              }, h('h1', 'component'))
              : undefined,
            h('button.refresh', {onclick: function () {}}, 'refresh'),
            h('button.remove', {onclick: function () { model.showComponent = false }}, 'remove')
          )
        }

        attach(render, {showComponent: true})

        var expectedParent = div.firstChild
        var expectedElement = div.firstChild.firstChild

        return monitor.waitForRenderAfter(click('button.refresh')).then(function () {
          return monitor.waitForRenderAfter(click('button.refresh'))
        }).then(function () {
          return monitor.waitForRenderAfter(click('button.remove'))
        }).then(function () {
          expect(events).to.eql([
            {
              type: 'onadd',
              parent: expectedParent,
              element: expectedElement
            },
            {
              type: 'onupdate',
              element: expectedElement,
              state: componentState
            },
            {
              type: 'onupdate',
              element: expectedElement,
              state: componentState
            },
            {
              type: 'onremove',
              element: expectedElement,
              state: componentState
            }
          ])
        })
      })

      it('throws error if not given vdom', function () {
        function render () {
          return vdomComponent(
            {
              onadd: function () {

              }
            }
          )
        }

        expect(function () { attach(render) }).to.throw('expects a vdom argument')
      })

      it('can expose long-running state for components', function () {
        function render () {
          return vdomComponent(
            {
              onbeforeadd: function () {
                this.counter = 2
              }
            },
            function () {
              var self = this

              return h('div',
                h('span.counter', this.counter),
                h('button.add', {onclick: function () { self.counter++ }}, 'add')
              )
            }
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
        function render (model) {
          return h('div',
            vdomComponent({
            },
              h('span.counter', model.counter)
            ),
            h('button.add', {onclick: function () { model.counter++ }}, 'add')
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
        function render (model) {
          return h('div',
            vdomComponent(function (component) {
              return h('div',
                h('span.inner-counter', model.counter),
                h('button.add-inner', {onclick: function () { model.counter++; return component }}, 'add inner')
              )
            }),
            h('span.outer-counter', model.counter),
            h('button.add-outer', {onclick: function () { model.counter++ }}, 'add outer')
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
        function render (model) {
          var component1 = vdomComponent(function (component) {
            return h('div',
                h('span.inner-counter', model.counter),
                h('button.add-inner', {onclick: function () { model.counter++; return component }}, 'add inner')
              )
          })

          return h('div',
            component1,
            vdomComponent(function (component) {
              return h('div',
                h('span.inner-counter2', model.counter),
                h('button.add-inner2', {onclick: function () { model.counter++; return [component, component1] }}, 'add inner 2')
              )
            }),
            h('span.outer-counter', model.counter),
            h('button.add-outer', {onclick: function () { model.counter++ }}, 'add outer')
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
        function render (model) {
          var component = vdomComponent(h('span.inner-counter', model.counter))

          return h('div',
            component,
            h('button', { onclick: function () { return component } }, 'refresh component')
          )
        }

        attach(render, {})

        return click('button').then(undefined, function (error) {
          expect(error.message).to.contain('refresh')
        })
      })

      it('can refresh the component when returned from an event, and handle lifetime events', function () {
        var events = []
        var refreshCount = 0

        function render (model) {
          refreshCount++
          return h('div',
            model.show
              ? vdomComponent(
                  vdomComponent(
                    {
                      onadd: function () {
                        events.push('add')
                      },
                      onupdate: function () {
                        events.push('update')
                      },
                      onremove: function () {
                        events.push('remove')
                      }
                    },
                    function () {
                      return h('div', 'rest of the content')
                    }
                  )
                )
              : undefined,
            h('button.refresh', {onclick: function () {}}, 'refresh'),
            h('label', 'show', h('input.show', {type: 'checkbox', binding: [model, 'show']}))
          )
        }

        var waitForRefresh = (function () {
          var oldRefreshCount = 1
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
                          'remove'
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
        var events = []

        function render (model) {
          model.value++
          var refresh = h.refresh

          return h('div',
            vdomComponent(
              {
                value: model.value,

                onadd: function (element) {
                  var self = this
                  element.addEventListener('click', function () {
                    events.push(self.value)
                    refresh()
                  })
                }
              },
              h('.button-' + model.value, 'click me')
            )
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
        var updates = 0
        var componentRenders = 0
        var renders = 0

        function render () {
          renders++
          return vdomComponent(
            {
              cacheKey: model.cacheKey,
              onupdate: function () {
                updates++
              }
            },
            function () {
              componentRenders++
              return h('button', {onclick: function () {}}, 'refresh')
            }
          )
        }

        var model = {
          cacheKey: 1
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
        var events = []

        function render () {
          return h('div',
            vdomComponent(
              {
                on: function (type, handler) {
                  return function () {
                    events.push('component ' + type)
                    return handler.apply(this, arguments)
                  }
                }
              },
              function () {
                return h('div',
                  vdomComponent(
                    {
                      on: function (type, handler) {
                        return function () {
                          events.push('inner component ' + type)
                          return handler.apply(this, arguments)
                        }
                      }
                    },
                    function () {
                      return h('button.inner-inner-component', {onclick: function () { events.push('inner inner click') }}, 'click me')
                    }
                  ),
                  h('button.inner-component', {onclick: function () { events.push('inner click') }}, 'click me')
                )
              }
            ),
            h('button.outer-component', {onclick: function () { events.push('outer click') }}, 'click me')
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
            expect(events).to.eql(['component click', 'inner click', 'inner component click', 'inner inner click', 'outer click'])
          })
        })
      })
    })

    describe('hyperdom.html.refreshAfter', function () {
      it('refreshes after the promise is complete', function () {
        var waiting

        function load (model) {
          return waiting
            ? undefined
            : (waiting = wait(20).then(function () {
              model.text = 'loaded'
            }))
        }

        function render (model) {
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

function wait (n) {
  return new Promise(function (resolve) {
    setTimeout(resolve, n)
  })
}

function contextInProduction (fn) {
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
