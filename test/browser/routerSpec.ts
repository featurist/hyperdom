import { expect } from 'chai'
import 'lie/polyfill'
import {html as h, Component, VdomFragment, RoutesComponent, Binding, RenderComponent} from '../..'
import * as hyperdomRouter from '../../router'
import * as detect from './detect'

import mountHyperdom = require('./mountHyperdom')
import stringify = Mocha.utils.stringify

describeRouter('hash')
if (detect.pushState) {
  describeRouter('pushState')
}

before(function () {
  const a = document.createElement('a')
  a.href = window.location.href
  a.innerText = 'refresh'
  document.body.appendChild(a)
})

function describeRouter (historyApiType: string) {
  describe('router (' + historyApiType + ')', function () {
    let router: hyperdomRouter.Router
    let historyApi: hyperdomRouter.RouteHistory

    function mount (app: Component, url?: string) {
      const options: any = {router}

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
      let app: RoutesComponent
      let routes: {
        [key: string]: hyperdomRouter.RouteHandler,
      }

      beforeEach(function () {
        routes = {
          a: router.route('/a'),
          b: router.route('/b'),
        }

        app = new class extends RoutesComponent {
          public routes () {
            return [
              routes.a({
                render () {
                  return h('div',
                    h('h1', 'a'),
                    h('button', { onclick () { routes.b.push() } }, 'b'),
                  )
                },
              }),
              routes.b({
                render () {
                  return h('div',
                    h('h1', 'b'),
                    h('button', { onclick () { routes.a.push() } }, 'a'),
                  )
                },
              }),
            ]
          }
        }()
      })

      it('can render the different routes', function () {
        const monkey = mount(app, '/a')

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
          const monkey = mount(app, '/a')

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
      return new class extends RenderComponent {
        public resolve: () => any
        public id: string | number
        private article: string | undefined

        public load (id: string | number) {
          this.id = id
          this.article = undefined
          return new Promise((resolve) => {
            this.resolve = resolve
          }).then(() => {
            this.article = 'this is article ' + id
          })
        }

        public render () {
          if (this.article) {
            return h('article', this.article)
          } else {
            return h('div.loading', 'loading article ' + this.id)
          }
        }
      }()
    }

    function loadsArticle (monkey: any, article: any, id: number | string) {
      return monkey.find('div.loading').shouldHave({text: 'loading article ' + id}).then(function () {
        article.resolve()
        return monkey.find('article').shouldHave({text: 'this is article ' + id})
      })
    }

    context('routes with bindings', function () {
      class MyApp extends RoutesComponent {
        public article = articleComponent()

        public routes () {
          const self = this

          return [
            routes.home({
              render () {
                return h('div',
                  h('h1', 'home'),
                  h('button', { onclick () { routes.article.push({id: 1}) } }, 'article 1'),
                )
              },
            }),

            routes.article({
              bindings: {
                id: [this.article, 'id', function (id: number) { return self.article.load(id) }] as Binding,
              },
              render () {
                return h('div',
                  h('h1', 'article ' + self.article.id),
                  self.article,
                  h('button', { onclick () { return self.article.load(2) } }, 'next'),
                )
              },
            }),
          ]
        }
      }
      let app: MyApp
      let routes: {
        [key: string]: hyperdomRouter.RouteHandler,
      }

      beforeEach(function () {
        routes = {
          home: router.route('/'),
          article: router.route('/articles/:id'),
        }

        app = new MyApp()
      })

      it('loads article on navigation', function () {
        const monkey = mount(app, '/')

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
          class MyApp extends RoutesComponent {
            public a: string

            public routes () {
              const self = this

              return [
                home({
                  render () {
                    return h('h1', 'home')
                  },
                }),
                route({
                  bindings: {
                    a: [this, 'a'],
                  },

                  push,

                  render () {
                    return h('h1', 'a = ' + self.a)
                  },
                }),
              ]
            }
          }
          let app: MyApp
          let route: hyperdomRouter.RouteHandler
          let home: hyperdomRouter.RouteHandler
          let push: hyperdomRouter.ParamsToPush

          beforeEach(function () {
            route = router.route('/:a')
            home = router.route('/')

            app = new MyApp()
          })

          context('when a is always push', function () {
            beforeEach(function () {
              push = {a: true}
            })

            it('pushes changes to binding a when it changes', function () {
              const monkey = mount(app, '/a')

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
              const monkey = mount(app, '/')

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
            let pushResult: boolean
            let oldParams: object
            let newParams: object

            beforeEach(function () {
              pushResult = false
              push = function (op: object, np: object) {
                oldParams = op
                newParams = np
                return pushResult
              }
            })

            it('pushes changes to binding a when it changes', function () {
              const monkey = mount(app, '/')

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
        class MyApp extends RoutesComponent {
          public article = articleComponent()

          public routes () {
            return [
              route({
                onload: (params: {id: number}) => {
                  return this.article.load(params.id)
                },

                render: () => {
                  return h('div',
                    this.article,
                  )
                },
              }),
            ]
          }
        }
        let app: MyApp
        let route: hyperdomRouter.RouteHandler

        beforeEach(function () {
          route = router.route('/:id')
          app = new MyApp()
        })

        it('loads the article each time the URL changes', function () {
          const monkey = mount(app, '/x')

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
      let redirectBack: boolean
      let a: hyperdomRouter.RouteHandler
      let b: hyperdomRouter.RouteHandler

      class MyApp extends RoutesComponent {
        public b: string

        constructor (readonly home: hyperdomRouter.RouteHandler) {
          super()
        }

        public routes () {
          const self = this

          return [
            this.home({
              render () {
                return h('h1', 'home')
              },
            }),

            a({
              redirect (params) {
                return b.url(params)
              },
            }),

            b({
              bindings: {
                b: [this, 'b'],
              },

              redirect (params) {
                if (redirectBack) {
                  return a.url(params)
                }
              },

              render () {
                return h('h1', 'b = ' + self.b)
              },
            }),
          ]
        }
      }
      let app: MyApp

      context('app with redirect', function () {
        beforeEach(function () {
          redirectBack = false

          const home = router.route('/')
          a = router.route('/a')
          b = router.route('/b')

          app = new MyApp(home)
        })

        it('redirects from one route to another', function () {
          const monkey = mount(app, '/a?b=x')

          return monkey.find('h1').shouldHave({text: 'b = x'}).then(function () {
            expect(router.url()).to.equal('/b?b=x')
          })
        })

        describe('recursive redirects', function () {
          it('throws error if redirects more than 10 times', function () {
            redirectBack = true
            const monkey = mount(app, '/')
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
        class MyApp extends RoutesComponent {
          public a = aComponent()

          constructor (readonly routeTable: hyperdomRouter.Routes) {
            super()
          }

          public routes () {
            const self = this

            return [
              this.routeTable.home({
                render () {
                  return h('h2', 'route home')
                },
              }),

              self.a,
            ]
          }

          public renderLayout (vdom: VdomFragment) {
            return h('div',
              h('h1', 'app'),
              vdom,
            )
          }
        }
        let app: MyApp
        let routes: hyperdomRouter.Routes

        function aComponent () {
          return new class extends RoutesComponent {
            private a: string
            private b: string

            public routes () {
              const self = this

              return [
                routes.a({
                  bindings: {
                    a: [this, 'a'],
                  },

                  render () {
                    return h('h3', 'route a: a = ' + self.a)
                  },
                }),

                routes.b({
                  bindings: {
                    a: [this, 'a'],
                    b: [this, 'b'],
                  },
                  render () {
                    return h('h3', 'route b: a = ' + self.a, ', b = ' + self.b)
                  },
                }),
              ]
            }

            protected renderLayout (vdom: VdomFragment) {
              return h('div',
                h('h2', 'component a'),
                vdom,
              )
            }
          }()
        }

        beforeEach(function () {
          routes = {
            home: router.route('/'),
            a: router.route('/:a'),
            b: router.route('/:a/:b'),
          }
          app = new MyApp(routes)
        })

        it('renders subroutes wrapping in outer component renders', function () {
          const monkey = mount(app, '/')

          return Promise.all([
            monkey.find('h1').shouldHave({text: 'app'}),
            monkey.find('h2').shouldHave({text: 'route home'}),
          ]).then(function () {
            routes.a.push({a: 'a'})
            app.refreshImmediately()

            return Promise.all([
              monkey.find('h1').shouldHave({text: 'app'}),
              monkey.find('h2').shouldHave({text: 'component a'}),
              monkey.find('h3').shouldHave({text: 'route a: a = a'}),
            ])
          }).then(function () {
            routes.b.push({a: 'a', b: 'c'})
            app.refreshImmediately()

            return Promise.all([
              monkey.find('h1').shouldHave({text: 'app'}),
              monkey.find('h2').shouldHave({text: 'component a'}),
              monkey.find('h3').shouldHave({text: 'route b: a = a, b = c'}),
            ])
          })
        })
      })
    })

    describe('base url', function () {
      class MyApp extends RoutesComponent {
        constructor (readonly routeTable: hyperdomRouter.Routes) {
          super()
        }
        public routes () {
          return [
            routes.home({
              render () {
                return h('div', h('h1', 'route: home'), h('a', {href: routes.a.href()}, 'link: a'))
              },
            }),
            routes.a({render () { return 'route: a' }}),
          ]
        }
      }
      let app: MyApp
      let routes: hyperdomRouter.Routes

      function withBaseUrl (baseUrl: string) {
        context('with baseUrl ' + baseUrl, function () {
          beforeEach(function () {
            router = hyperdomRouter.router({history: historyApi, baseUrl})

            routes = {
              home: router.route('/'),
              a: router.route('/a'),
            }

            app = new MyApp(routes)
          })

          it('URL /baseurl is recognised by route /', function () {
            historyApi.push(baseUrl)
            const monkey = mount(app)
            return monkey.shouldHave({text: 'route: home'})
          })

          it('URL /baseurl/a is recognised by route /a', function () {
            historyApi.push((baseUrl + '/a').replace('//', '/'))
            const monkey = mount(app)
            return monkey.shouldHave({text: 'route: a'})
          })

          it('can push urls', function () {
            historyApi.push(baseUrl)
            const monkey = mount(app)
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
            const monkey = mount(app)
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
            const monkey = mount(app)
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
            const monkey = mount(app)
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
        const routes = {
          a: router.route('/a'),
          b: router.route('/b'),
        }

        const app = new class extends RoutesComponent {
          public routes () {
            return [
              routes.a({render () { return 'a' }}),
              routes.b({render () { return 'b' }}),
            ]
          }
        }()

        const monkey = mount(app, '/c')

        return monkey.shouldHave({text: 'no route'}).then(function () {
          return monkey.shouldHave({text: '/c'})
        }).then(function () {
          return monkey.shouldHave({text: '/a'})
        }).then(function () {
          return monkey.shouldHave({text: '/b'})
        })
      })

      it('can render custom 404 page', function () {
        const routes = {
          a: router.route('/a'),
          b: router.route('/b'),
        }

        const app = new class extends RoutesComponent {
          public routes () {
            return [
              routes.a({render () { return 'a' }}),
              routes.b({render () { return 'b' }}),
              router.notFound(function (url, routesTried) {
                const routes = routesTried.map(function (r) { return r.definition.pattern }).join(', ')
                return 'route ' + url + ' custom not found, tried ' + routes
              }),
            ]
          }
        }()

        const monkey = mount(app, '/c')

        return monkey.shouldHave({text: 'route /c custom not found, tried /a, /b'})
      })
    })

    describe('route definitions', function () {
      context('with baseUrl', function () {
        const baseUrl = '/baseurl'

        beforeEach(function () {
          router = hyperdomRouter.router({history: historyApi, baseUrl})
        })

        routeDefinitionSpecs()
      })

      context('with no baseUrl', function () {
        routeDefinitionSpecs()
      })

      function routeDefinitionSpecs () {
        describe('with no parameters', function () {
          it('route is active when its pattern matches', function () {
            const route = router.route('/')

            router.push('/')
            expect(route.isActive()).to.equal(true)
          })

          it("route is not active when the pattern doesn't match", function () {
            const route = router.route('/')

            router.push('/something')
            expect(route.isActive()).to.equal(false)
          })

          it('route is active when the pattern with parameters matches', function () {
            const route = router.route('/article/:id')

            router.push('/article/5')
            expect(route.isActive()).to.equal(true)
          })

          it('route is active when the pattern with query string matches', function () {
            const route = router.route('/')

            router.push('/?page=3')
            expect(route.isActive()).to.equal(true)
          })
        })

        describe('with parameters', function () {
          it('is active parameters match', function () {
            const route = router.route('/article/:id')

            router.push('/article/5?page=3')
            expect(route.isActive({id: 5, page: 3})).to.equal(true)
          })

          it('is active when given parameters match', function () {
            const route = router.route('/article/:id')

            router.push('/article/5?page=3')
            expect(route.isActive({id: 5, missing: undefined})).to.equal(true)
          })

          it('is not active when given undefined parameters do not match', function () {
            const route = router.route('/article/:id')

            router.push('/article/5?page=3')
            expect(route.isActive({id: 5, page: undefined})).to.equal(false)
          })

          it('is not active when parameters do not match', function () {
            const route = router.route('/article/:id')

            router.push('/article/5?page=3')
            expect(route.isActive({id: 10, page: 3})).to.equal(false)
          })

          it('is not active when given parameters do not match', function () {
            const route = router.route('/article/:id')

            router.push('/article/5?page=3')
            expect(route.isActive({id: 10})).to.equal(false)
          })
        })
      }
    })
  })
}
