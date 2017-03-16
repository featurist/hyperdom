/* eslint-env mocha */

var reloadButton = require('browser-monkey/reloadButton')
var mount = require('browser-monkey/hyperdom')
var router = require('hyperdom/router')
var h = require('hyperdom').html
var expect = require('chai').expect

describe('router', function () {
  after(function () {
    reloadButton()
  })

  context('app with two routes', function () {
    var app
    var routes

    beforeEach(function () {
      routes = {
        a: router.route('/a'),
        b: router.route('/b')
      }

      app = {
        routes: function () {
          return [
            routes.a({
              render: function () {
                return h('div',
                  h('h1', 'a'),
                  h('button', { onclick: function () { routes.b.push() } }, 'b')
                )
              }
            }),
            routes.b({
              render: function () {
                return h('div',
                  h('h1', 'b'),
                  h('button', { onclick: function () { routes.a.push() } }, 'a')
                )
              }
            })
          ]
        }
      }
    })

    it('can render the different routes', function () {
      var monkey = mount(app, {url: '/a', router: router})

      return monkey.find('h1').shouldHave({text: 'a'}).then(function () {
        return monkey.find('button', {text: 'b'}).click()
      }).then(function () {
        return monkey.find('h1').shouldHave({text: 'b'})
      }).then(function () {
        return monkey.find('button', {text: 'a'}).click()
      }).then(function () {
        return monkey.find('h1').shouldHave({text: 'a'})
      })
    })

    it('can navigate backward and forward', function () {
      var monkey = mount(app, {url: '/a', router: router})

      return monkey.find('h1').shouldHave({text: 'a'}).then(function () {
        return monkey.find('button', {text: 'b'}).click()
      }).then(function () {
        return monkey.find('h1').shouldHave({text: 'b'})
      }).then(function () {
        window.history.back()
        return monkey.find('h1').shouldHave({text: 'a'})
      }).then(function () {
        window.history.forward()
        return monkey.find('h1').shouldHave({text: 'b'})
      })
    })
  })

  function articleComponent() {
    return {
      load: function(id) {
        var self = this

        this.id = id
        this.article = undefined
        return new Promise((resolve) => {
          self.resolve = resolve
        }).then(function () {
          self.article = 'this is article ' + id
        })
      },

      render: function() {
        if (this.article) {
          return h('article', this.article)
        } else {
          return h('div.loading', 'loading article ' + this.id)
        }
      }
    }
  }

  function loadsArticle(monkey, article, id) {
    return monkey.find('div.loading').shouldHave({text: 'loading article ' + id}).then(function () {
      article.resolve()
      return monkey.find('article').shouldHave({text: 'this is article ' + id})
    })
  }

  context('routes with bindings', function () {
    var app
    var routes

    beforeEach(function () {
      routes = {
        home: router.route('/'),
        article: router.route('/articles/:id')
      }

      app = {
        article: articleComponent(),

        routes: function () {
          var self = this

          return [
            routes.home({
              render: function () {
                return h('div',
                  h('h1', 'home'),
                  h('button', { onclick: function () { routes.article.push({id: 1}) } }, 'article 1')
                )
              }
            }),

            routes.article({
              bindings: {
                id: [this.article, 'id', function (id) { return self.article.load(id) }]
              },
              render: function () {
                return h('div',
                  h('h1', 'article ' + self.articleId),
                  self.article,
                  h('button', { onclick: function () { return self.article.load(2) } }, 'next')
                )
              }
            })
          ]
        }
      }
    })

    it('loads article on navigation', function () {
      var monkey = mount(app, { url: '/', router: router })

      return monkey.button('article 1').click().then(function () {
        return loadsArticle(monkey, app.article, 1)
      }).then(function () {
        return monkey.button('next').click()
      }).then(function () {
        return loadsArticle(monkey, app.article, 2)
      })
    })
  })

  describe('onload', function () {
    context('app with onload', function () {
      var app
      var route

      beforeEach(function () {
        route = router.route('/:id')

        app = {
          article: articleComponent(),

          routes: function () {
            var self = this

            return [
              route({
                onload: function(params) {
                  return self.article.load(params.id)
                },

                render: function () {
                  return h('div',
                    self.article
                  )
                }
              })
            ]
          }
        }
      })

      it('loads the article each time the URL changes', function () {
        var monkey = mount(app, { url: '/x', router: router })

        return loadsArticle(monkey, app.article, 'x').then(function () {
          route.push({id: 'y'})
          app.rerender()
          return loadsArticle(monkey, app.article, 'y')
        }).then(function () {
          route.push({id: 'z'})
          app.rerender()
          return loadsArticle(monkey, app.article, 'z')
        })
      })
    })
  })

  describe('sub routes', function () {
    var events

    context('app with sub routes', function () {
      var app
      var routes

      events = []

      function aComponent(a) {
        return {
          a: a,

          routes: function () {
            var self = this

            return [
              routes.a({
                render: function () {
                  return h('h1', 'a = ' + self.a)
                }
              }),
              routes.b({
                bindings: {
                  b: [this, 'b']
                },
                render: function () {
                  return h('h1', 'b = ' + self.b)
                }
              })
            ]
          }
        }
      }

      beforeEach(function () {
        routes = {
          home: router.route('/'),
          a: router.route('/:a'),
          b: router.route('/:a/:b')
        }

        app = {
          routes: function () {
            return [
              routes.home({
              }),

              routes.a({
                onload: function (params) {
                  events.push(['outer onload', params])
                  this.a = aComponent(params.a)
                },

                routes: function () {
                  events.push(['outer routes'])
                  return this.a
                },

                render: function (vdom) {
                  events.push(['outer render'])
                  return h('div',
                    h('div.menu', 'menu'),
                    vdom
                  )
                }
              })
            ]
          }
        }
      })

      it('calls onload, routes and render on the outer component', function () {
        var monkey = mount(app, {url: '/a/b', router: router})

        expect(events).to.eql([
          ['outer onload', {a: 'a', url: '/a/b'}],
          ['outer routes'],
          ['outer render']
        ])

        events = []

        return Promise.all([
          monkey.find('div.menu').shouldHave({text: 'menu'}),
          monkey.find('h1').shouldHave({text: 'b = b'})
        ]).then(function () {
          routes.b.push({a: 'a', b: 'c'})
          app.rerender()

          return Promise.all([
            monkey.find('div.menu').shouldHave({text: 'menu'}),
            monkey.find('h1').shouldHave({text: 'b = c'})
          ])
        }).then(function () {
          expect(events).to.eql([
            ['outer onload', {a: 'a', url: '/a/c'}],
            ['outer routes'],
            ['outer render']
          ])

          events = []
        })
      })
    })
  })
})
