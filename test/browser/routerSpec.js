/* eslint-env mocha */

require('lie/polyfill')

var mountHyperdom = require('./mountHyperdom')
var hyperdomRouter = require('../../router')
var h = require('../..').html
var expect = require('chai').expect
var detect = require('./detect')
var pushStateThrottle = require('./pushStateThrottle')

before(function () {
  var a = document.createElement('a')
  a.href = window.location.href
  a.innerText = 'refresh'
  document.body.appendChild(a)
})

var memoryHistoryApiService = {
  name: 'memory',

  canReplace: true,

  beforeEach: function () {
    return Promise.resolve()
  },

  afterEach: function () {
    return Promise.resolve()
  },

  historyApi: function () {
    this._historyApi = hyperdomRouter.memory()
    return this._historyApi
  },

  forward: function () {
    this._historyApi.forward()
  },

  back: function () {
    this._historyApi.back()
  },

  destroy: function () {
    return Promise.resolve()
  }
}

var pushStateHistoryApiService = {
  name: 'pushState',

  canReplace: true,

  beforeEach: function () {
    return pushStateThrottle.start()
  },

  afterEach: function () {
    return pushStateThrottle.stop()
  },

  historyApi: function () {
    this._historyApi = hyperdomRouter.pushState()
    return this._historyApi
  },

  forward: function () {
    window.history.forward()
  },

  back: function () {
    window.history.back()
  },

  destroy: function () {
    return Promise.resolve()
  }
}

var hashHistoryApiService = {
  name: 'hash',

  isHash: true,

  beforeEach: function () {
    return Promise.resolve()
  },

  afterEach: function () {
    return Promise.resolve()
  },

  historyApi: function () {
    this._historyApi = hyperdomRouter.hash()
    return this._historyApi
  },

  forward: function () {
    window.history.forward()
  },

  back: function () {
    window.history.back()
  },

  destroy: function () {
    return this._historyApi.waitForHashChangeEvents()
  }
}

describeRouter(hashHistoryApiService)
if (detect.pushState) {
  describeRouter(pushStateHistoryApiService)
}
describeRouter(memoryHistoryApiService)

function describeRouter (historyApiService) {
  describe('router (' + historyApiService.name + ')', function () {
    var router
    var historyApi

    function mount (app, url) {
      var options = {router: router}

      options.url = url

      return mountHyperdom(app, options)
    }

    function resetRouter () {
      if (router) {
        router.reset()
      }

      historyApi = historyApiService.historyApi()

      router = hyperdomRouter.router({history: historyApi})
    }

    beforeEach(function () {
      this.timeout(35000)
      return historyApiService.beforeEach().then(function () {
        if (historyApi) {
          return historyApiService.destroy().then(function () {
            resetRouter()
          })
        } else {
          resetRouter()
        }
      })
    })

    afterEach(function () {
      return historyApiService.afterEach()
    })

    describe('history api', function () {
      var refresh

      function waitForRefresh (fn) {
        var promise = new Promise(function (resolve) {
          refresh = resolve
        })

        fn()

        return promise
      }

      beforeEach(function () {
        historyApi.push('/')
        historyApi.start({
          refresh: function () {
            refresh()
          }
        })
      })

      it('can push a url', function () {
        historyApi.push('/a')
        expect(historyApi.url()).to.equal('/a')
      })

      it('can replace a url', function () {
        historyApi.replace('/a')
        expect(historyApi.url()).to.equal('/a')
      })

      if (detect.historyBack) {
        describe('navigating back and forward', function () {
          it('when push, going back goes to previous url', function () {
            historyApi.push('/a')
            historyApi.push('/b')
            return waitForRefresh(function () {
              historyApiService.back()
            }).then(function () {
              expect(historyApi.url()).to.equal('/a')
            })
          })

          it('can go back and forward', function () {
            historyApi.push('/a')
            historyApi.push('/b')
            return waitForRefresh(function () {
              historyApiService.back()
            }).then(function () {
              expect(historyApi.url()).to.equal('/a')
            }).then(function () {
              return waitForRefresh(function () {
                historyApiService.forward()
              }).then(function () {
                expect(historyApi.url()).to.equal('/b')
              })
            })
          })

          if (historyApiService.canReplace) {
            it('when replace, going back goes to previous previous url', function () {
              historyApi.push('/a')
              historyApi.push('/b')
              historyApi.replace('/c')
              return waitForRefresh(function () {
                historyApiService.back()
              }).then(function () {
                expect(historyApi.url()).to.equal('/a')
              })
            })
          }
        })
      }
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
            historyApiService.back()
            return monkey.find('h1').shouldHave({text: 'a'})
          }).then(function () {
            historyApiService.forward()
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

    if (historyApiService.canReplace) {
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
                expect(historyApi.url()).to.equal('/b')
                historyApiService.back()
                return monkey.find('h1').shouldHave({text: 'a = a'})
              }).then(function () {
                expect(historyApi.url()).to.equal('/a')
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
                historyApiService.back()
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
                historyApiService.back()
                return monkey.find('h1').shouldHave({text: 'a = a'})
              }).then(function () {
                app.a = 'b'
                pushResult = false
                app.refresh()
                return monkey.find('h1').shouldHave({text: 'a = b'})
              }).then(function () {
                expect(oldParams).to.eql({a: 'a'})
                expect(newParams).to.eql({a: 'b'})
                historyApiService.back()
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
                  onload: function (location) {
                    return self.article.load(location.params.id)
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

            /*
            if (historyApiService.isHash) {
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
            */
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

    describe('middleware', function () {
      describe('rendering routes in models', function () {
        it('models can return a single route', function () {
          var app = {
            routes: function () {
              return function () {
                return container('model')
              }
            }
          }
          var monkey = mount(app, '/')
          return monkey.find('.model').shouldExist()
        })

        it('models can return an array of routes', function () {
          var app = {
            routes: function () {
              return [
                function () {
                },
                function () {
                  return container('model')
                }
              ]
            }
          }
          var monkey = mount(app, '/')
          return monkey.find('.model').shouldExist()
        })

        it('models can return a model, that model has its onload called', function () {
          var component = {
            onload: function () {
              this.state = 'state'
            },

            routes: function () {
              var self = this
              return function () {
                return container(self.state)
              }
            }
          }
          var app = {
            routes: function () {
              return component
            }
          }
          var monkey = mount(app, '/')
          return monkey.find('.state').shouldExist()
        })
      })

      describe('rendering arrays of routes', function () {
        it('renders the first route', function () {
          var app = {
            routes: function () {
              return [
                function () {
                  return container('first')
                },
                function () {
                  return container('second')
                }
              ]
            }
          }
          var monkey = mount(app, '/')
          return monkey.find('.first').shouldExist()
        })

        it('renders the second route', function () {
          var app = {
            routes: function () {
              return [
                function () {
                },
                function () {
                  return container('second')
                }
              ]
            }
          }
          var monkey = mount(app, '/')
          return monkey.find('.second').shouldExist()
        })
      })

      describe('rendering a sequence of routes', function () {
        it('the outer can wrap the inner', function () {
          var app = {
            routes: function () {
              return function (location) {
                return container('outer', location.renderRoutes(function (location) {
                  return container('inner', location.renderRoutes(function () {
                    return container('inner-inner')
                  }))
                }))
              }
            }
          }
          var monkey = mount(app, '/')
          return monkey.find('.outer > .inner > .inner-inner').shouldExist()
        })

        it('the outer can prevent the inner from rendering', function () {
          var app = {
            routes: function () {
              return function () {
                return container('outer')
              }
            }
          }
          var monkey = mount(app, '/')
          return monkey.find('.outer').shouldExist()
        })

        it('the outer can wrap an array of routes', function () {
          var app = {
            routes: function () {
              return function (location) {
                return container('outer', location.renderRoutes([
                  function () {
                  },
                  function () {
                    return container('.inner')
                  }
                ]))
              }
            }
          }
          var monkey = mount(app, '/')
          return monkey.find('.outer > .inner').shouldExist()
        })

        it('the outer can wrap a model', function () {
          var component = {
            routes: function () {
              return function () {
                return container('model')
              }
            }
          }

          var app = {
            routes: function () {
              return function (location) {
                return container('outer', location.renderRoutes(component))
              }
            }
          }
          var monkey = mount(app, '/')
          return monkey.find('.outer > .model').shouldExist()
        })

        it('throws if nothing is given', function () {
          var app = {
            routes: function () {
              return function (location) {
                return container('outer', location.renderRoutes())
              }
            }
          }
          expect(function () {
            mount(app, '/')
          }).to.throw('expected a route to be a function, an array, or a model')
        })
      })

      describe('rendering routes from routes', function () {
        it('can setup the model then render sub-routes', function () {
          var route = router.route('/')

          var app = {
            routes: function () {
              return route({
                onload: function () {
                  this.state = 'state'
                },

                routes: function () {
                  var self = this
                  return function () {
                    return container(self.state)
                  }
                }
              })
            }
          }
          var monkey = mount(app, '/')
          return monkey.find('.state').shouldExist()
        })

        it('can run route function behind URL', function () {
          var routeA = router.route('/a')
          var routeB = router.route('/b')

          var app = {
            routes: function () {
              return [
                routeA(function () { return container('a') }),
                routeB(function () { return container('b') })
              ]
            }
          }
          var monkey = mount(app, '/b')
          return monkey.find('.b').shouldExist()
        })
      })

      describe('redirects', function () {
        it('can redirect to a route', function () {
          var lastRouteExecuted = false
          var app = {
            routes: function () {
              return [
                function (location) {
                  if (location.url === '/redirect') {
                    return container('redirect')
                  }
                },
                function (location) {
                  location.replace('/redirect')
                },
                function (location) {
                  lastRouteExecuted = true
                }
              ]
            }
          }
          var monkey = mount(app, '/')
          return monkey.find('.redirect').shouldExist().then(function () {
            expect(lastRouteExecuted).to.equal(false)
          })
        })
      })

      describe('renderLayout', function () {
        it('renders layout from model', function () {
          var app = {
            routes: function () {
              return function (location, next) {
                return container('content')
              }
            },

            renderLayout: function (vdom) {
              return container('layout', vdom)
            }
          }

          var monkey = mount(app, '/')
          return monkey.find('.layout > .content').shouldExist()
        })

        it('renders all layouts from parent models', function () {
          var inner = {
            routes: function () {
              return [
                function () {
                  return container('content')
                }
              ]
            },

            renderLayout: function (vdom) {
              return container('inner-layout', vdom)
            }
          }

          var app = {
            routes: function () {
              return [
                inner
              ]
            },

            renderLayout: function (vdom) {
              return container('outer-layout', vdom)
            }
          }

          var monkey = mount(app, '/')
          return monkey.find('.outer-layout > .inner-layout > .content').shouldExist()
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
              router.notFound(function (location) {
                var routes = location.routesAttempted.map(function (r) { return r.definition.pattern }).join(', ')
                return 'route ' + location.url + ' custom not found, tried ' + routes
              })
            ]
          }
        }

        var monkey = mount(app, '/c')

        return monkey.shouldHave({text: 'route /c custom not found, tried /a, /b'})
      })

      it('can render custom 404 page with corresponding layout', function () {
        var component1 = {
          routes: function () {
            return [
              router.notFound(function (location) {
                return container('not-found')
              })
            ]
          },

          renderLayout: function (vdom) {
            return container('component-1-layout', vdom)
          }
        }

        var component2 = {
          routes: function () {
            return [
              function () {
              }
            ]
          },

          renderLayout: function (vdom) {
            return container('component-2-layout', vdom)
          }
        }

        var app = {
          routes: function () {
            return [
              component1,
              component2
            ]
          }
        }

        var monkey = mount(app, '/c')

        return monkey.find('.component-1-layout > .not-found').shouldExist()
      })
    })

    describe('route definitions', function () {
      context('with baseUrl', function () {
        var baseUrl = '/baseurl'

        beforeEach(function () {
          router = hyperdomRouter.router({history: historyApi, baseUrl: baseUrl})
        })

        routeDefinitionSpecs()
      })

      context('with no baseUrl', function () {
        routeDefinitionSpecs()
      })

      function routeDefinitionSpecs () {
        describe('with no parameters', function () {
          it('route is active when its pattern matches', function () {
            var route = router.route('/')

            router.push('/')
            expect(route.isActive()).to.equal(true)
          })

          it("route is not active when the pattern doesn't match", function () {
            var route = router.route('/')

            router.push('/something')
            expect(route.isActive()).to.equal(false)
          })

          it('route is active when the pattern with parameters matches', function () {
            var route = router.route('/article/:id')

            router.push('/article/5')
            expect(route.isActive()).to.equal(true)
          })

          it('route is active when the pattern with query string matches', function () {
            var route = router.route('/')

            router.push('/?page=3')
            expect(route.isActive()).to.equal(true)
          })
        })

        describe('with parameters', function () {
          it('is active parameters match', function () {
            var route = router.route('/article/:id')

            router.push('/article/5?page=3')
            expect(route.isActive({id: 5, page: 3})).to.equal(true)
          })

          it('is active when given parameters match', function () {
            var route = router.route('/article/:id')

            router.push('/article/5?page=3')
            expect(route.isActive({id: 5, missing: undefined})).to.equal(true)
          })

          it('is not active when given undefined parameters do not match', function () {
            var route = router.route('/article/:id')

            router.push('/article/5?page=3')
            expect(route.isActive({id: 5, page: undefined})).to.equal(false)
          })

          it('is not active when parameters do not match', function () {
            var route = router.route('/article/:id')

            router.push('/article/5?page=3')
            expect(route.isActive({id: 10, page: 3})).to.equal(false)
          })

          it('is not active when given parameters do not match', function () {
            var route = router.route('/article/:id')

            router.push('/article/5?page=3')
            expect(route.isActive({id: 10})).to.equal(false)
          })
        })
      }
    })

    function container (name, child) {
      return h('.' + name,
        h('h1', name),
        child
      )
    }
  })
}
