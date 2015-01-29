var $ = require('jquery');
var plastiq = require('../..');
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
    plastiq.attach(div, render, model, { requestRender: setTimeout });
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

    it('can bind with a shorthand binding syntax', function () {
      function render(model) {
        return h('div',
          h('input', {type: 'text', binding: [model, 'text']}),
          h('span', model.text)
        );
      }

      attach(render, {text: ''});

      find('input').sendkeys('omg');

      return retry(function() {
        expect(find('span').text()).to.equal('omg');
        expect(find('input').val()).to.equal('omg');
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
        find('option.red').prop('selected', true);
        find('select').change();

        return retry(function() {
          expect(find('span').text()).to.equal('"red"');
          expect(find('option.red').prop('selected')).to.equal(true);
        }).then(function () {
          find('option.blue').prop('selected', true);
          find('select').change();

          return retry(function() {
            expect(find('span').text()).to.equal('{"name":"blue"}');
            expect(find('option.blue').prop('selected')).to.equal(true);
          });
        });
      });
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
                  }, 20);
                }, 20);
              }, 20);
            }, 20);
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
