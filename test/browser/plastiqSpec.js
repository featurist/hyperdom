var $ = require('jquery');
var plastiq = require('../..');
var router = plastiq.router();
var h = plastiq.html;
var expect = require('chai').expect;
var retry = require('trytryagain');
require('jquery-sendkeys');

describe('plastiq', function () {
  var div;

  beforeEach(function () {
    $('.test').remove();
    div = $('<div class="test"/>').appendTo(document.body)[0]
  });

  function attach(render, model) {
    plastiq.append(div, render, model, { requestRender: setTimeout });
  }

  function find(selector) {
    return $(div).find(selector);
  }

  function wait(n) {
    return new Promise(function (result) {
      setTimeout(result, n);
    });
  }

  function click(selector) {
    return retry(function () {
      expect(find(selector).length).to.equal(1, "could not find button '" + selector + "'");
    }).then(function () {
      find(selector).click();
    });
  }

  describe('attaching', function () {
    var targetDiv;

    beforeEach(function () {
      targetDiv = $('<div></div>').appendTo(div)[0];
    });

    it('can append an element as a child of another', function () {
      function render() {
        return h('div.rendered');
      }

      plastiq.append(targetDiv, render);

      expect(div.innerHTML).to.equal('<div><div class="rendered"></div></div>');
    });

    it('can replace an element', function () {
      function render() {
        return h('div.rendered');
      }

      plastiq.replace(targetDiv, render);

      expect(div.innerHTML).to.equal('<div class="rendered"></div>');
    });
  });

  describe('rendering', function () {
    it('can render a div', function () {
      function render(model) {
        return h('div.haha');
      }

      attach(render, {});

      expect(find('.haha').length).to.eql(1);
    });
    it('can render pound sign', function () {
      function render(model) {
        return h('div','£');
      }

      attach(render, {});

      expect(find('div').text()).to.eql('£');
    });

    function itCanRenderA(type, value, expectedValue) {
      it('can render a ' + type, function () {
        function render(model) {
          return h('div.haha', value);
        }

        attach(render, {});

        expect(find('.haha').text()).to.eql(expectedValue != undefined? expectedValue: String(value));
      });
    }

    itCanRenderA('number', 4);
    itCanRenderA('boolean', true);
    itCanRenderA('date', new Date());
    itCanRenderA('undefined', undefined, '');

    describe('class', function () {
      it('accepts a string', function () {
        function render(model) {
          return h('div.one', {class: 'two three'});
        }

        attach(render, {});

        expect(find('div').attr('class')).to.eql('one two three');
      });

      it('accepts an array', function () {
        function render(model) {
          return h('div.one', {class: ['two', 'three']});
        }

        attach(render, {});

        expect(find('div').attr('class')).to.eql('one two three');
      });

      it('accepts an object', function () {
        function render(model) {
          return h('div.one', {class: {two: true, three: true, four: false}});
        }

        attach(render, {});

        expect(find('div').attr('class')).to.eql('one two three');
      });
    });

    describe('selectors', function () {
      function selectorProduces(selector, expectedSelector) {
        it("h('" + selector + "') produces '" + expectedSelector + "'", function () {
          function render() {
            return h(selector);
          }

          attach(render);

          expect(find(expectedSelector).length).to.equal(1);
        });
      }

      selectorProduces('div.class', 'div.class');
      selectorProduces('div#id', 'div#id');
      selectorProduces('div.class#id', 'div.class#id');
      selectorProduces('h1 a', 'h1 a');
    });

    describe('attribute naming exceptions', function () {
      it('can render a for attribute', function () {
          function render(model) {
            return h('div',
              h('label', {for: 'blah'})
            );
          }

          attach(render, {text: 'one'});

          expect(find('label').attr('for')).to.eql('blah');
      });
    });

    describe('non-standard HTML attributes', function () {
      it('can be rendered by passing an attributes object', function () {
          function render(model) {
            return h('div',
              h('input', {
                type: 'text',
                attributes: { autocapitalize: 'none', autofocus: true }
              })
            );
          }

          attach(render, {});

          expect(find('input').attr('autocapitalize')).to.equal('none');
          expect(find('input').attr('autofocus')).to.equal('autofocus');
      });
    });

    describe('raw unescaped HTML', function () {
      it('can render raw HTML', function () {
        function render(model) {
          return h('div',
            model.text
              ? h.rawHtml('p', 'some <strong>dangerous HTML (' + model.text + ')')
              : undefined,
            h('button.two', {onclick: function () { model.text = 'two'; }}),
            h('button.three', {onclick: function () { model.text = ''; }})
          );
        }

        attach(render, {text: 'one'});

        expect(find('p').html()).to.eql('some <strong>dangerous HTML (one)</strong>');

        return click('button.two').then(function () {

          return retry(function () {
            expect(find('p').html()).to.eql('some <strong>dangerous HTML (two)</strong>');
          }).then(function () {
            return click('button.three').then(function () {
              return retry(function () {
                expect(find('p').length).to.eql(0);
              });
            });
          });
        });
      });

      it('can render raw HTML with attributes', function () {
        function render(model) {
          return h('div',
            h.rawHtml('p.raw', {style: {color: 'red'}}, 'some <strong>dangerous HTML')
          );
        }

        attach(render, {text: 'one'});

        var p = find('p');
        expect(p.html()).to.eql('some <strong>dangerous HTML</strong>');
        expect(p.attr('class')).to.eql('raw');
        expect(p.attr('style')).to.eql('color: red;');
      });

      it('updates the dom when the HTML changes', function() {
        function render(model) {
          return h('div',
            h.rawHtml('p.raw', model.html),
            h('p.x', model.x),
            h('button.one', {onclick: function () { model.x = 'zzz'; }}),
            h('button.two', {onclick: function () { model.html = 'Nice <b>HTML</b>'; }})
          );
        }

        attach(render, {html: 'Naughty <b>HTML</b>', x: 'yyy'});

        expect(find('p.raw').html()).to.equal('Naughty <b>HTML</b>');

        var b = find('p.raw b')[0];

        return click('button.one').then(function () {
          return retry(function() {
            expect(find('p.x').html()).to.equal('zzz');
          }).then(function() {
            expect(find('p.raw b')[0]).to.equal(b);
            return click('button.two').then(function () {
              return retry(function() {
                expect(find('p.raw b')[0]).not.to.equal(b);
              });
            });
          })
        });
      });
    });
  });

  it('can respond to button clicks', function () {
    function render(model) {
      return h('div',
        h('button', {
          onclick: function () {
            model.on = true;
          }
        }),
        model.on? h('span', 'on'): undefined
      );
    }

    attach(render, {});

    return click('button').then(function () {
      return retry(function () {
        expect(find('span').text()).to.eql('on');
      });
    });
  });

  it('can respond to button clicks after promise resolves', function () {
    function render(model) {
      return h('div',
        h('button', {
          onclick: function () {
            return new Promise(function (result) {
              model.on = true;
              result();
            });
          }
        }),
        model.on? h('span', 'on'): undefined
      );
    }

    attach(render, {});

    return click('button').then(function () {
      return retry(function () {
        expect(find('span').text()).to.eql('on');
      });
    });
  });

  describe('norefresh', function () {
    it("when returned the view doesn't refresh after the handler has run", function () {
      var refreshes = 0;
      function render(model) {
        refreshes++;

        return h('div',
          h('button.refresh', {
            onclick: function () {
            }
          }),
          h('button.norefresh', {
            onclick: function () {
              return h.norefresh;
            }
          }),
          h('span', refreshes)
        );
      }

      attach(render, {});

      return click('button.refresh').then(function () {
        return retry(function () {
          expect(refreshes).to.eql(2);
        }).then(function () {
          return click('button.norefresh').then(function () {
            return wait(10).then(function () {
              return retry(function () {
                expect(refreshes, 'expected not to refresh').to.eql(2);
              }).then(function () {
                return click('button.refresh').then(function () {
                  return retry(function () {
                    expect(refreshes, 'expected to refresh').to.eql(3);
                  });
                });
              });
            });
          });
        });
      });
    });
  });

  describe('model binding', function () {
    it('can bind to a text input', function () {
      function render(model) {
        return h('div',
          h('input', {type: 'text', binding: [model, 'text']}),
          h('span', model.text)
        );
      }

      attach(render, {text: ''});

      find('input').sendkeys('haha');

      return retry(function() {
        expect(find('span').text()).to.equal('haha');
        expect(find('input').val()).to.equal('haha');
      });
    });

    it('can bind to a text input converting to number', function () {
      function render(model) {
        return h('div',
          h('input', {type: 'text', binding: [model, 'number', Number]}),
          h('span', model.number)
        );
      }

      var model = {number: 0};
      attach(render, model);

      find('input').sendkeys('{selectall}{backspace}123');

      return retry(function() {
        expect(find('span').text()).to.equal('123');
        expect(find('input').val()).to.equal('123');
        expect(model.number).to.equal(123);
      });
    });

    it('when model returns undefined, it clears the input', function () {
      function render(model) {
        return h('div',
          h('input', {type: 'text', binding: [model, 'text']}),
          h('button.clear', {onclick: function () { delete model.text; }}, 'clear'),
          h('span', model.text)
        );
      }

      attach(render, {text: ''});

      find('input').sendkeys('haha');

      return retry(function() {
        expect(find('span').text()).to.equal('haha');
        expect(find('input').val()).to.equal('haha');
        return click('button.clear').then(function () {
          return retry(function () {
            expect(find('span').text()).to.equal('');
            expect(find('input').val()).to.equal('');
          });
        });
      });
    });

    it('can bind to a text input and oninput', function () {
      function render(model) {
        return h('div',
          h('input', {
            type: 'text',
            binding: [model, 'tempText'],
            oninput: function (ev) {
              model.text = model.tempText;
            }
          }),
          h('span', model.text)
        );
      }

      attach(render, {text: ''});

      find('input').sendkeys('haha{newline}');

      return retry(function() {
        expect(find('span').text()).to.equal('haha');
        expect(find('input').val()).to.equal('haha');
      });
    });

    it('can bind to a textarea', function () {
      function render(model) {
        return h('div',
          h('textarea', {binding: [model, 'text']}),
          h('span', model.text)
        );
      }

      attach(render, {text: ''});

      find('textarea').sendkeys('haha');

      return retry(function() {
        expect(find('span').text()).to.equal('haha');
        expect(find('textarea').val()).to.equal('haha');
      });
    });

    it('can bind to a checkbox', function () {
      function render(model) {
        return h('div',
          h('input', {type: 'checkbox', binding: [model, 'check']}),
          h('span', model.check? 'on': 'off')
        );
      }

      attach(render, {check: false});

      return retry(function() {
        expect(find('span').text()).to.equal('off');
        expect(find('input').prop('checked')).to.equal(false);
      }).then(function () {
        find('input').click();

        return retry(function() {
          expect(find('span').text()).to.equal('on');
          expect(find('input').prop('checked')).to.equal(true);
        });
      });
    });

    it('can bind to radio buttons', function () {
      var blue = { name: 'blue' };

      function render(model) {
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
        );
      }

      attach(render, { colour: blue });

      return retry(function() {
        expect(find('span').text()).to.equal('{"name":"blue"}');
        expect(find('input.blue').prop('checked')).to.equal(true);
        expect(find('input.red').prop('checked')).to.equal(false);
      }).then(function () {
        find('input.red').click();

        return retry(function() {
          expect(find('span').text()).to.equal('"red"');
          expect(find('input.red').prop('checked')).to.equal(true);
        }).then(function () {
          find('input.blue').click();

          return retry(function() {
            expect(find('span').text()).to.equal('{"name":"blue"}');
            expect(find('input.blue').prop('checked')).to.equal(true);
          });
        });
      });
    });

    it('can bind to select', function () {
      var blue = { name: 'blue' };

      function render(model) {
        return h('div',
          h('select',
            {binding: [model, 'colour']},
            h('option.red', {value: 'red'}, 'red'),
            h('option.blue', {value: blue}, 'blue')
          ),
          h('span', JSON.stringify(model.colour))
        );
      }

      attach(render, { colour: blue });

      return retry(function() {
        expect(find('span').text()).to.equal('{"name":"blue"}');
        expect(find('option.red').prop('selected')).to.equal(false);
        expect(find('option.blue').prop('selected')).to.equal(true);
      }).then(function () {
        find('select')[0].selectedIndex = 0;
        find('select').change();

        return retry(function() {
          expect(find('span').text()).to.equal('"red"');
          expect(find('option.red').prop('selected')).to.equal(true);
        }).then(function () {
          find('select')[0].selectedIndex = 1;
          find('select').change();

          return retry(function() {
            expect(find('span').text()).to.equal('{"name":"blue"}');
            expect(find('option.blue').prop('selected')).to.equal(true);
          });
        });
      });
    });
  });

  describe('routes', function () {
    var originalHref;

    beforeEach(function () {
      originalHref = location.href;
      history.pushState(undefined, undefined, '/');
    });

    afterEach(function () {
      history.pushState(undefined, undefined, originalHref);
    });

    describe('url drives model', function () {
      var timer;
      var model;

      beforeEach(function () {
        var objects = [
          { name: 'one', id: 1 },
          { name: 'two', id: 2 },
          { name: 'three', id: 3 },
          { name: 'four', id: 4 }
        ];

        function render(model) {
          return h('div',
            h('.header', 'Hi ', model.name),
            router(
              router.page('/', function () {
                return h('div',
                  h('h1', 'root'),
                  h('a', {href: '/objects', onclick: router.push}, 'objects')
                );
              }),
              router.page('/objects',
                {
                  binding: [model, 'objects'],
                  state: function () {
                    return new Promise(function (result) {
                      setTimeout(function () {
                        result(objects);
                      }, 300);
                    });
                  }
                },
                function () {
                  return h('div',
                    h('h1', 'objects'),
                    h('ul',
                      model.objects.map(function (o) {
                        return h('li', h('a', {
                          onclick: function () {
                            router.push('/objects/' + o.id);
                          }
                        }, o.name));
                      })
                    )
                  );
                }
              ),
              router.page('/objects/:id',
                {
                  binding: [model, 'object'],
                  state: function (params) {
                    return new Promise(function (result) {
                      setTimeout(function () {
                        result(objects.filter(function (o) { return o.id == Number(params.id); })[0]);
                      }, 300);
                    });
                  }
                },
                function () {
                  return h('div',
                    h('h1', 'object'),
                    h('p', model.object.name)
                  );
                }
              )
            )
          );
        }

        model = {name: 'User'};
        attach(render, model);

        timer = {
          start: function() {
            this.startTime = new Date().getTime();
          },
          stop: function () {
            this.elapsed = new Date().getTime() - this.startTime;
          }
        };
      });

      it('can navigate from root, to objects, to object, loading state each time', function () {
        expect(find('h1').text()).to.equal('root');
        expect(model.objects).to.not.exist;
        expect(model.object).to.not.exist;
        timer.start();
        return click('a:contains("objects")').then(function () {
          return retry(function () {
            expect(find('h1').text()).to.equal('objects');
            expect(model.objects).to.exist;
            expect(model.object).to.not.exist;
          }).then(function () {
            timer.stop();
            expect(timer.elapsed).to.be.greaterThan(300);
            timer.start();
            return click('li a:contains("one")').then(function () {
              return retry(function () {
                expect(find('h1').text()).to.equal('object');
                expect(find('p').text()).to.equal('one');
                expect(model.objects).to.not.exist;
                expect(model.object).to.exist;
              }).then(function () {
                timer.stop();
                expect(timer.elapsed).to.be.greaterThan(300);
              });
            });
          });
        });
      });

      it('navigates back and forward, without reloading state', function () {
        expect(find('h1').text()).to.equal('root');
        expect(model.objects).to.not.exist;
        expect(model.object).to.not.exist;
        return click('a:contains("objects")').then(function () {
          return retry(function () {
            expect(find('h1').text()).to.equal('objects');
            expect(model.objects).to.exist;
            expect(model.object).to.not.exist;
          }).then(function () {
            return click('li a:contains("one")').then(function () {
              return retry(function () {
                expect(find('h1').text()).to.equal('object');
                expect(find('p').text()).to.equal('one');
                expect(model.objects).to.not.exist;
                expect(model.object).to.exist;
              }).then(function () {
                history.back();
                timer.start();
                return retry(function () {
                  expect(find('h1').text()).to.equal('objects');
                  expect(model.objects).to.exist;
                  expect(model.object).to.not.exist;
                }).then(function () {
                  timer.stop();
                  expect(timer.elapsed).to.be.lessThan(300);

                  history.back();
                  timer.start();
                  return retry(function () {
                    expect(find('h1').text()).to.equal('root');
                    expect(model.objects).to.not.exist;
                    expect(model.object).to.not.exist;
                  }).then(function () {
                    timer.stop();
                    expect(timer.elapsed).to.be.lessThan(300);

                    history.forward();
                    timer.start();
                    return retry(function () {
                      expect(find('h1').text()).to.equal('objects');
                      expect(model.objects).to.exist;
                      expect(model.object).to.not.exist;
                    }).then(function () {
                      timer.stop();
                      expect(timer.elapsed).to.be.lessThan(300);

                      history.forward();
                      timer.start();
                      return retry(function () {
                        expect(find('h1').text()).to.equal('object');
                        expect(find('p').text()).to.equal('one');
                        expect(model.objects).to.not.exist;
                        expect(model.object).to.exist;
                      }).then(function () {
                        timer.stop();
                        expect(timer.elapsed).to.be.lessThan(300);
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });

    describe('state is stored', function () {
      beforeEach(function () {
        function render(model) {
          return router(
            router.page('/', function () {
              return h('button', {onclick: function () { router.push('/counter/10'); } }, 'start');
            }),
            router.page('/counter/:n',
              {
                binding: [model, 'counter'],
                state: function (params) {
                  return Number(params.n);
                }
              },
              function () {
                return h('div',
                  h('h1', model.counter),
                  h('button.count', {onclick: function () { model.counter++; }}, 'count'),
                  h('a.somewhere', {href: '/somewhere', onclick: router.push}, 'count')
                );
              }
            ),
            router.page('/somewhere',
              function () {
                return h('h1', 'somewhere');
              }
            )
          );
        }

        attach(render, {});
      });

      it('state can be updated after the route, then is kept after coming back', function () {
        return click('button').then(function () {
          return retry(function () {
            expect(find('h1').text()).to.equal('10');
          }).then(function () {
            return click('button.count').then(function () {
              return retry(function () {
                expect(find('h1').text()).to.equal('11');
              }).then(function () {
                return click('a.somewhere').then(function () {
                  return retry(function () {
                    expect(find('h1').text()).to.equal('somewhere');
                  }).then(function () {
                    history.back();

                    return retry(function () {
                      expect(find('h1').text()).to.equal('11');
                    });
                  });
                });
              });
            });
          });
        });
      });
    });

    describe('model drives url', function () {
      beforeEach(function () {
        function render(model) {
          return router(
            router.page('/', function () {
              return h('button', {onclick: function () { router.push('/counter/10'); } }, 'start');
            }),
            router.page('/counter/:n',
              {
                binding: [model, 'counter'],
                state: function (params) {
                  return Number(params.n);
                },
                url: function (state) {
                  return '/counter/' + state;
                }
              },
              function () {
                return h('div',
                  h('h1', model.counter),
                  h('button.count', {onclick: function () { model.counter++; }}, 'count')
                );
              }
            )
          );
        }

        attach(render, {});
      });

      it('state can be updated after the route, then is kept after coming back', function () {
        return click('button').then(function () {
          return retry(function () {
            expect(find('h1').text()).to.equal('10');
          }).then(function () {
            return click('button.count').then(function () {
              return retry(function () {
                expect(find('h1').text()).to.equal('11');
                expect(location.pathname).to.equal('/counter/11');
              });
            });
          });
        });
      });
    });

    it('state is set on startup', function () {
      function render(model) {
        return router(
          router.page('/',
            function () {
              return h('h1', 'root');
            }
          ),
          router.page('/page',
            {
              binding: [model, 'state'],
              state: 'state'
            },
            function () {
              return h('span.state', model.state);
            }
          )
        );
      }

      history.pushState(undefined, undefined, '/page');
      var model = {};
      attach(render, model);

      expect(find('span.state').text()).to.equal('state');
      expect(model.state).to.equal('state');
    });
  });

  describe('plastiq.html.component', function () {
    it('receives onadd, onupdate and onremove events after the DOM changes have been made', function () {
      var events = [];
      var componentState;

      function render(model) {
        return h('div',
          model.showComponent
            ? h.component({
                onadd: function (element) {
                  events.push({
                    type: 'onadd',
                    parent: element.parentNode,
                    element: element
                  });
                  componentState = this;
                },
                onupdate: function (element) {
                  events.push({
                    type: 'onupdate',
                    element: element,
                    state: this
                  });
                },
                onremove: function (element) {
                  events.push({
                    type: 'onremove',
                    element: element,
                    state: this
                  });
                }
              })
            : undefined,
          h('button.refresh', {onclick: function () {}},  'refresh'),
          h('button.remove', {onclick: function () { model.showComponent = false; }}, 'remove')
        );
      }

      attach(render, {showComponent: true});

      var expectedParent = div.firstChild;
      var expectedElement = div.firstChild.firstChild;

      return click('button.refresh').then(function () {
        return wait(30).then(function () {
          return click('button.refresh').then(function () {
            return wait(30).then(function () {
              return click('button.remove').then(function () {
                return wait(30).then(function () {
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
                  ]);
                });
              });
            });
          });
        });
      });
    });

    it('renders and updates the vdom inside the component', function () {
      var events = [];

      function render(model) {
        return h('div',
          h.component({
            },
            h('span.counter', model.counter)
          ),
          h('button.add', {onclick: function () { model.counter++; }},  'add')
        );
      }

      attach(render, {counter: 0});

      return click('button.add').then(function () {
        return wait(30).then(function () {
          return retry(function () {
            expect(find('span.counter').text()).to.equal('1');
          }).then(function () {
            return click('button.add').then(function () {
              return retry(function () {
                expect(find('span.counter').text()).to.equal('2');
              });
            });
          });
        });
      });
    });

    it('only refreshes the component when returned from an event', function () {
      var events = [];

      function render(model) {
        var component = h.component(function () {
          return h('span.inner-counter', model.counter)
        });

        return h('div',
          component,
          h('span.outer-counter', model.counter),
          h('button.add-inner', {onclick: function () { model.counter++; return component; }},  'add inner'),
          h('button.add-outer', {onclick: function () { model.counter++; }},  'add outer')
        );
      }

      attach(render, {counter: 0});

      expect(find('span.inner-counter').text()).to.equal('0');
      expect(find('span.outer-counter').text()).to.equal('0');

      return click('button.add-inner').then(function () {
        return retry(function () {
          expect(find('span.inner-counter').text()).to.equal('1');
          expect(find('span.outer-counter').text()).to.equal('0');
        }).then(function () {
          return click('button.add-outer').then(function () {
            return retry(function () {
              expect(find('span.inner-counter').text()).to.equal('2');
              expect(find('span.outer-counter').text()).to.equal('2');
            });
          });
        });
      });
    });

    it('throws exception when component is returned from event but does not have a render function', function () {
      function render(model) {
        var component = h.component(h('span.inner-counter', model.counter));

        return h('div',
          component,
          h('button', { onclick: function () { return component; } }, 'refresh component')
        );
      }

      attach(render, {});

      return click('button').then(undefined, function(error) {
        expect(error.message).to.contain('refresh');
      });
    });

    it('can refresh the component when returned from an event, and handle lifetime events', function () {
      var events = [];
      var refreshCount = 0;

      function render(model) {
        refreshCount++;
        return h('div',
          model.show
            ? h.component(
                h.component(
                  {
                    onadd: function (element) {
                      events.push('add');
                    },
                    onupdate: function (previous, element) {
                      events.push('update');
                    },
                    onremove: function (element) {
                      events.push('remove');
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
        );
      }

      var waitForRefresh = (function () {
        var oldRefreshCount = 1;
        return function () {
          return retry(function () {
            expect(refreshCount).to.equal(oldRefreshCount + 1);
          }).then(function () {
            oldRefreshCount = refreshCount;
          });
        };
      })();

      attach(render, {});

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
                      ]);
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });

  describe('plastiq.html.refresh', function () {
    it('refreshes the UI when called', function () {
      function render(model) {
        var refresh = h.refresh;

        return h('div',
          h('h1', model.text),
          h('button.refresh', {
            onclick: function () {
              setTimeout(function () {
                model.text = 'after timeout';
                refresh();
              }, 50);
            }
          },
          'refresh')
        );
      }

      attach(render, {text: 'before timeout'});

      return click('button.refresh').then(function () {
        return wait(20).then(function () {
          return retry(function () {
            expect(find('h1').text()).to.equal('before timeout');
          }).then(function () {
            return retry(function () {
              expect(find('h1').text()).to.equal('after timeout');
            });
          });
        });
      });
    });

    it('refreshes a component when called with that component', function () {
      function render(model) {
        var refresh = h.refresh;
        var component = h.component(function () { return h('h2', model.text); });

        return h('div',
          h('h1', model.text),
          component,
          h('button.refresh', {
            onclick: function () {
              setTimeout(function () {
                model.text = 'after timeout';
                refresh(component);
              }, 50);
            }
          },
          'refresh')
        );
      }

      attach(render, {text: 'before timeout'});

      return click('button.refresh').then(function () {
        return wait(20).then(function () {
          return retry(function () {
            expect(find('h1').text()).to.equal('before timeout');
            expect(find('h2').text()).to.equal('before timeout');
          }).then(function () {
            return retry(function () {
              expect(find('h1').text()).to.equal('before timeout');
              expect(find('h2').text()).to.equal('after timeout');
            });
          });
        });
      });
    });

    it('must be taken during render cycle, or exception is thrown', function () {
      function render(model) {
        var refresh = h.refresh;

        return h('div',
          h('h1', model.text),
          h('button.refresh', {
            onclick: function () {
              setTimeout(function () {
                try {
                  model.text = 'after timeout';
                  h.refresh();
                } catch (e) {
                  model.text = e.message;
                  refresh();
                }
              }, 50);
            }
          },
          'refresh')
        );
      }

      attach(render, {text: 'before timeout'});

      return click('button.refresh').then(function () {
        return wait(20).then(function () {
          return retry(function () {
            expect(find('h1').text()).to.equal('before timeout');
          }).then(function () {
            return retry(function () {
              expect(find('h1').text()).to.include("plastiq.html.refresh");
            });
          });
        });
      });
    });
  });

  describe('plastiq.html.promise', function () {
    it('renders pending until the promise is fulfilled', function () {
      function render(model) {
        return h('div',
          h('div.one',
            h.promise(model.promise1, {
              pending: 'pending 1',
              fulfilled: function (value) {
                return 'fulfilled 1 ' + value;
              }
            })
          ),
          h('div.two',
            h.promise(model.promise2, {
              pending: 'pending 2',
              fulfilled: function (value) {
                return 'fulfilled 2 ' + value;
              }
            })
          )
        );
      }

      attach(render, {
        promise1: new Promise(function (fulfill) {
          setTimeout(function () {
            fulfill('value 1');
          }, 30);
        }),
        promise2: new Promise(function (fulfill) {
          setTimeout(function () {
            fulfill('value 2');
          }, 60);
        })
      });

      expect(find('div.one').text()).to.equal('pending 1');
      expect(find('div.two').text()).to.equal('pending 2');
      return retry(function () {
        expect(find('div.one').text()).to.equal('fulfilled 1 value 1');
        expect(find('div.two').text()).to.equal('pending 2');
      }).then(function () {
        return retry(function () {
          expect(find('div.one').text()).to.equal('fulfilled 1 value 1');
          expect(find('div.two').text()).to.equal('fulfilled 2 value 2');
        });
      });
    });

    it('renders pending until the promise is rejected', function () {
      function render(model) {
        return h('div',
          h('div.one',
            h.promise(model.promise1, {
              pending: 'pending 1',
              rejected: function (reason) {
                return 'rejected 1 ' + reason;
              }
            })
          ),
          h('div.two',
            h.promise(model.promise2, {
              pending: 'pending 2',
              rejected: function (reason) {
                return 'rejected 2 ' + reason;
              }
            })
          )
        );
      }

      attach(render, {
        promise1: new Promise(function (fulfill, reject) {
          setTimeout(function () {
            reject('reason 1');
          }, 30);
        }),
        promise2: new Promise(function (fulfill, reject) {
          setTimeout(function () {
            reject('reason 2');
          }, 60);
        })
      });

      expect(find('div.one').text()).to.equal('pending 1');
      expect(find('div.two').text()).to.equal('pending 2');
      return retry(function () {
        expect(find('div.one').text()).to.equal('rejected 1 reason 1');
        expect(find('div.two').text()).to.equal('pending 2');
      }).then(function () {
        return retry(function () {
          expect(find('div.one').text()).to.equal('rejected 1 reason 1');
          expect(find('div.two').text()).to.equal('rejected 2 reason 2');
        });
      });
    });

    it('takes a non-promise as a fulfilled promise', function () {
      function render(model) {
        return h('div',
          h.promise(model.value, {
            pending: 'pending',
            fulfilled: function (value) {
              return 'fulfilled ' + value;
            }
          })
        );
      }

      attach(render, {
        value: 'value'
      });

      expect(find('div').text()).to.equal('fulfilled value');
    });
  });

  describe('plastiq.html.animation', function () {
    it('can refresh several times', function () {
      function render(model) {
        return h('div', model.counter, h.animation(model.animation.bind(model)));
      }

      attach(render, {
        animation: function (refresh) {
          var self = this;

          setTimeout(function () {
            self.counter++;
            refresh();

            setTimeout(function () {
              self.counter++;
              refresh();

              setTimeout(function () {
                self.counter++;
                refresh();
              }, 40);
            }, 40);
          }, 40);
        },
        counter: 0
      });

      expect(find('div').text()).to.equal('0');
      return retry(function () {
        expect(find('div').text()).to.equal('1');
      }).then(function () {
        return retry(function () {
          expect(find('div').text()).to.equal('2');
        }).then(function () {
          return retry(function () {
            expect(find('div').text()).to.equal('3');
          });
        })
      });
    });
  });

  describe('plastiq.html.window', function () {
    it('can add and remove event handlers on window', function () {
      function render(model) {
        return h('div',
          model.active
            ? h.window(
                {
                  onclick: function () {
                    model.clicks++;
                  }
                }
              )
            : undefined,
          model.active
            ? h('button.disactivate', {onclick: function () { model.active = false; return false; }}, 'disactivate')
            :  h('button.activate', {onclick: function () { model.active = true; return false; }}, 'activate'),
          h('div.click', 'click here'),
          h('div.clicks', model.clicks)
        );
      }

      attach(render, {clicks: 0, active: false});

      return click('button.activate').then(function () {
        return retry(function () {
          return expect(find('button.disactivate').length).to.equal(1);
        }).then(function () {
          return click('div.click').then(function () {
            return retry(function() {
              expect(find('div.clicks').text()).to.equal('1');
            }).then(function () {
              return click('button.disactivate').then(function () {
                return retry(function () {
                  expect(find('button.activate').length).to.equal(1);
                }).then(function () {
                  return click('div.click').then(function () {
                    wait(30).then(function () {
                      return retry(function() {
                        expect(find('div.clicks').text()).to.equal('1');
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });

  describe('animations', function () {
    it('can render several frames of an animation', function () {
      this.timeout(10000);

      var delay = 40;

      function render(model) {
        function startOperation() {
          return function (render) {
            setTimeout(function () {
              model.progress = 'one';
              render();
              setTimeout(function () {
                model.progress = 'two';
                render();
                setTimeout(function () {
                  model.progress = 'three';
                  render();
                  setTimeout(function () {
                    model.progress = 'four';
                    render();
                  }, delay);
                }, delay);
              }, delay);
            }, delay);
          };
        }

        return h('div',
          h('button', {onclick: startOperation}, 'start'),
          h('span', model.progress)
        );
      }

      attach(render, {});

      expect(find('span').text()).to.equal('');

      return click('button').then(function () {
        return retry(function () {
          expect(find('span').text()).to.equal('one');
          return retry(function () {
            expect(find('span').text()).to.equal('two');
            return retry(function () {
              expect(find('span').text()).to.equal('three');
              return retry(function () {
                expect(find('span').text()).to.equal('four');
              });
            });
          });
        });
      });
    });
  });
});
