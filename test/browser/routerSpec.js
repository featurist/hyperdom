/* eslint-env mocha */

require('lie/polyfill')

var mountHyperdom = require('./mountHyperdom')
var hyperdomRouter = require('../../router')
var h = require('../..').html
var expect = require('chai').expect
var detect = require('./detect')

describeRouter('hash')
if (detect.pushState) {
  describeRouter('pushState')
}

function describeRouter (historyApiType) {
  describe('router (' + historyApiType + ')', function () {
    var router
    var historyApi

    function mount (app, url) {
      var options = {router: router}

      if (historyApiType === 'hash') {
        options.hash = url
      } else {
        options.url = url
      }

      return mountHyperdom(app, options)
    }

    function resetRouter () {
      if (router) {
        router.reset()
      }

      historyApi = historyApiType === 'hash'
        ? hyperdomRouter.hash()
        : hyperdomRouter.pushState()

      router = hyperdomRouter.router({history: historyApi})
    }

    beforeEach(function () {
      resetRouter()
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
        var monkey = mount(app, '/a')

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

      if (detect.historyBack) {
        it('can navigate backward and forward', function () {
          var monkey = mount(app, '/a')

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
      }
    })

    function articleComponent () {
      return {
        load: function (id) {
          var self = this

          this.id = id
          this.article = undefined
          return new Promise(function (resolve) {
            self.resolve = resolve
          }).then(function () {
            self.article = 'this is article ' + id
          })
        },

        render: function () {
          if (this.article) {
            return h('article', this.article)
          } else {
            return h('div.loading', 'loading article ' + this.id)
          }
        }
      }
    }

    function loadsArticle (monkey, article, id) {
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
        var monkey = mount(app, '/')

        return monkey.button('article 1').click().then(function () {
          return loadsArticle(monkey, app.article, 1)
        }).then(function () {
          return monkey.button('next').click()
        }).then(function () {
          return loadsArticle(monkey, app.article, 2)
        })
      })
    })

    if (historyApiType === 'pushState') {
      describe('push replace', function () {
        context('app with bindings', function () {
          var app
          var route
          var home
          var push

          beforeEach(function () {
            route = router.route('/:a')
            home = router.route('/')

            app = {
              routes: function () {
                var self = this

                return [
                  home({
                    render: function () {
                      return h('h1', 'home')
                    }
                  }),
                  route({
                    bindings: {
                      a: [this, 'a']
                    },

                    push: push,

                    render: function () {
                      return h('h1', 'a = ' + self.a)
                    }
                  })
                ]
              }
            }
          })

          context('when a is always push', function () {
            beforeEach(function () {
              push = {a: true}
            })

            it('pushes changes to binding a when it changes', function () {
              var monkey = mount(app, '/a')

              return monkey.find('h1').shouldHave({text: 'a = a'}).then(function () {
                app.a = 'b'
                app.refresh()
                return monkey.find('h1').shouldHave({text: 'a = b'})
              }).then(function () {
                expect(window.location.pathname).to.equal('/b')
                window.history.back()
                return monkey.find('h1').shouldHave({text: 'a = a'})
              }).then(function () {
                expect(window.location.pathname).to.equal('/a')
              })
            })
          })

          context('when a is never push', function () {
            beforeEach(function () {
              push = {a: false}
            })

            it('pushes changes to binding a when it changes', function () {
              var monkey = mount(app, '/')

              return monkey.find('h1').shouldHave({text: 'home'}).then(function () {
                route.push({a: 'a'})
                app.refresh()
              }).then(function () {
                return monkey.find('h1').shouldHave({text: 'a = a'})
              }).then(function () {
                app.a = 'b'
                app.refresh()
                return monkey.find('h1').shouldHave({text: 'a = b'})
              }).then(function () {
                window.history.back()
                return monkey.find('h1').shouldHave({text: 'home'})
              })
            })
          })

          context('when a is sometimes push', function () {
            var pushResult
            var oldParams
            var newParams

            beforeEach(function () {
              pushResult = false
              push = function (_oldParams, _newParams) {
                oldParams = _oldParams
                newParams = _newParams
                return pushResult
              }
            })

            it('pushes changes to binding a when it changes', function () {
              var monkey = mount(app, '/')

              return monkey.find('h1').shouldHave({text: 'home'}).then(function () {
                route.push({a: 'a'})
                app.refresh()
              }).then(function () {
                return monkey.find('h1').shouldHave({text: 'a = a'})
              }).then(function () {
                app.a = 'b'
                pushResult = true
                app.refresh()
                return monkey.find('h1').shouldHave({text: 'a = b'})
              }).then(function () {
                expect(oldParams).to.eql({a: 'a'})
                expect(newParams).to.eql({a: 'b'})
                window.history.back()
                return monkey.find('h1').shouldHave({text: 'a = a'})
              }).then(function () {
                app.a = 'b'
                pushResult = false
                app.refresh()
                return monkey.find('h1').shouldHave({text: 'a = b'})
              }).then(function () {
                expect(oldParams).to.eql({a: 'a'})
                expect(newParams).to.eql({a: 'b'})
                window.history.back()
                return monkey.find('h1').shouldHave({text: 'home'})
              })
            })
          })
        })
      })
    }

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
                  onload: function (params) {
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
          var monkey = mount(app, '/x')

          return loadsArticle(monkey, app.article, 'x').then(function () {
            route.push({id: 'y'})
            app.refresh()
            return loadsArticle(monkey, app.article, 'y')
          }).then(function () {
            route.push({id: 'z'})
            app.refresh()
            return loadsArticle(monkey, app.article, 'z')
          })
        })
      })
    })

    describe('redirect', function () {
      var app
      var a
      var b

      context('app with redirect', function () {
        var redirectBack

        beforeEach(function () {
          redirectBack = false

          var home = router.route('/')
          a = router.route('/a')
          b = router.route('/b')

          app = {
            routes: function () {
              var self = this

              return [
                home({
                  render: function () {
                    return h('h1', 'home')
                  }
                }),

                a({
                  redirect: function (params) {
                    return b.url(params)
                  }
                }),

                b({
                  bindings: {
                    b: [this, 'b']
                  },

                  redirect: function (params) {
                    if (redirectBack) {
                      return a.url(params)
                    }
                  },

                  render: function () {
                    return h('h1', 'b = ' + self.b)
                  }
                })
              ]
            }
          }
        })

        it('redirects from one route to another', function () {
          var monkey = mount(app, '/a?b=x')

          return monkey.find('h1').shouldHave({text: 'b = x'}).then(function () {
            expect(router.url()).to.equal('/b?b=x')
          })
        })

        describe('recursive redirects', function () {
          it('throws error if redirects more than 10 times', function () {
            redirectBack = true
            var monkey = mount(app, '/')
            a.push({b: 'x'})
            expect(function () {
              app.refreshImmediately()
            }).to.throw(/too many redirects(\n|.)*\/a\?b=x(\n|.)*\/b\?b=x/m)

            if (historyApiType === 'hash') {
              // the recursive redirects test pushes a lot of URLs
              // in the hash form, this generates a lot of hashchange
              // events, which disrupts the next test
              //
              // here we mount the app, push a new hash and wait for
              // all the previous hashchanges to run out
              // resetRouter()
              redirectBack = false
              a.push({b: 'y'})
              return monkey.find('h1').shouldHave({text: 'b = y'})
            }
          })
        })
      })
    })

    describe('sub routes', function () {
      context('app with sub routes', function () {
        var app
        var routes

        function aComponent () {
          return {
            routes: function () {
              var self = this

              return [
                routes.a({
                  bindings: {
                    a: [this, 'a']
                  },

                  render: function () {
                    return h('h3', 'route a: a = ' + self.a)
                  }
                }),

                routes.b({
                  bindings: {
                    a: [this, 'a'],
                    b: [this, 'b']
                  },
                  render: function () {
                    return h('h3', 'route b: a = ' + self.a, ', b = ' + self.b)
                  }
                })
              ]
            },

            renderLayout: function (vdom) {
              return h('div',
                h('h2', 'component a'),
                vdom
              )
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
            a: aComponent(),

            routes: function () {
              var self = this

              return [
                routes.home({
                  render: function () {
                    return h('h2', 'route home')
                  }
                }),

                self.a
              ]
            },

            renderLayout: function (vdom) {
              return h('div',
                h('h1', 'app'),
                vdom
              )
            }
          }
        })

        it('renders subroutes wrapping in outer component renders', function () {
          var monkey = mount(app, '/')

          return Promise.all([
            monkey.find('h1').shouldHave({text: 'app'}),
            monkey.find('h2').shouldHave({text: 'route home'})
          ]).then(function () {
            routes.a.push({a: 'a'})
            app.refreshImmediately()

            return Promise.all([
              monkey.find('h1').shouldHave({text: 'app'}),
              monkey.find('h2').shouldHave({text: 'component a'}),
              monkey.find('h3').shouldHave({text: 'route a: a = a'})
            ])
          }).then(function () {
            routes.b.push({a: 'a', b: 'c'})
            app.refreshImmediately()

            return Promise.all([
              monkey.find('h1').shouldHave({text: 'app'}),
              monkey.find('h2').shouldHave({text: 'component a'}),
              monkey.find('h3').shouldHave({text: 'route b: a = a, b = c'})
            ])
          })
        })
      })
    })

    describe('base url', function () {
      var app
      var routes

      function withBaseUrl (baseUrl) {
        context('with baseUrl ' + baseUrl, function () {
          beforeEach(function () {
            router = hyperdomRouter.router({history: historyApi, baseUrl: baseUrl})

            routes = {
              home: router.route('/'),
              a: router.route('/a')
            }

            app = {
              routes: function () {
                return [
                  routes.home({render: function () { return h('div', h('h1', 'route: home'), h('a', {href: routes.a.href()}, 'link: a')) }}),
                  routes.a({render: function () { return 'route: a' }})
                ]
              }
            }
          })

          it('URL /baseurl is recognised by route /', function () {
            historyApi.push(baseUrl)
            var monkey = mount(app)
            return monkey.shouldHave({text: 'route: home'})
          })

          it('URL /baseurl/a is recognised by route /a', function () {
            historyApi.push((baseUrl + '/a').replace('//', '/'))
            var monkey = mount(app)
            return monkey.shouldHave({text: 'route: a'})
          })

          it('can push urls', function () {
            historyApi.push(baseUrl)
            var monkey = mount(app)
            return monkey.shouldHave({text: 'route: home'}).then(function () {
              routes.a.push()
              app.refresh()
              return monkey.shouldHave({text: 'route: a'}).then(function () {
                expect(historyApi.url()).to.equal('/baseurl/a')
              })
            })
          })

          it('can push /', function () {
            historyApi.push(baseUrl)
            var monkey = mount(app)
            return monkey.shouldHave({text: 'route: home'}).then(function () {
              routes.home.push()
              app.refresh()
              return monkey.shouldHave({text: 'route: home'}).then(function () {
                expect(historyApi.url()).to.equal(baseUrl)
              })
            })
          })

          it('can replace urls', function () {
            historyApi.push(baseUrl)
            var monkey = mount(app)
            return monkey.shouldHave({text: 'route: home'}).then(function () {
              routes.a.replace()
              app.refresh()
              return monkey.shouldHave({text: 'route: a'}).then(function () {
                expect(historyApi.url()).to.equal('/baseurl/a')
              })
            })
          })

          it('can navigate', function () {
            historyApi.push(baseUrl)
            var monkey = mount(app)
            return monkey.shouldHave({text: 'route: home'}).then(function () {
              return monkey.find('a', {text: 'link: a'}).click()
            }).then(function () {
              return monkey.shouldHave({text: 'route: a'}).then(function () {
                expect(historyApi.url()).to.equal('/baseurl/a')
              })
            })
          })
        })
      }

      withBaseUrl('/baseurl')
      withBaseUrl('/baseurl/')
    })

    describe('404', function () {
      it("when the route isn't found it shows all routes, and the current URL", function () {
        var routes = {
          a: router.route('/a'),
          b: router.route('/b')
        }

        var app = {
          routes: function () {
            return [
              routes.a({render: function () { return 'a' }}),
              routes.b({render: function () { return 'b' }})
            ]
          }
        }

        var monkey = mount(app, '/c')

        return monkey.shouldHave({text: 'no route'}).then(function () {
          return monkey.shouldHave({text: '/c'})
        }).then(function () {
          return monkey.shouldHave({text: '/a'})
        }).then(function () {
          return monkey.shouldHave({text: '/b'})
        })
      })

      it('can render custom 404 page', function () {
        var routes = {
          a: router.route('/a'),
          b: router.route('/b')
        }

        var app = {
          routes: function () {
            return [
              routes.a({render: function () { return 'a' }}),
              routes.b({render: function () { return 'b' }}),
              router.notFound(function (url, routesTried) {
                var routes = routesTried.map(function (r) { return r.pattern }).join(', ')
                return 'route ' + url + ' custom not found, tried ' + routes
              })
            ]
          }
        }

        var monkey = mount(app, '/c')

        return monkey.shouldHave({text: 'route /c custom not found, tried /a, /b'})
      })
    })
  })
}
