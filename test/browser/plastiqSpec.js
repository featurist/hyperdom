var $ = require('jquery');
var plastiq = require('../..');
var h = plastiq.html;
var expect = require('chai').expect;
var retry = require('trytryagain');
require('jquery-sendkeys');
var rendering = require('../../rendering');

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

      it('can render a contenteditable attribute', function () {
          function render(model) {
            return h('div', {contenteditable: true});
          }

          attach(render);

          expect(find('div').attr('contenteditable')).to.eql('true');
      });

      it('can render a tabindex attribute', function () {
          function render(model) {
            return h('div', {tabindex: 3});
          }

          attach(render);

          expect(find('div').attr('tabindex')).to.eql('3');
      });

      it('can render data- attributes', function () {
          function render(model) {
            return h('div', {'data-one': 'one', 'data-two': 'two'});
          }

          attach(render);

          expect(find('div').data('one')).to.eql('one');
          expect(find('div').data('two')).to.eql('two');
      });

      it('can render data- and dataset attributes', function () {
          function render(model) {
            return h('div', {'data-one': 'one', 'data-two': 'two', dataset: {three: 'three'}});
          }

          attach(render);

          expect(find('div').data('one')).to.eql('one');
          expect(find('div').data('two')).to.eql('two');
          expect(find('div').data('three')).to.eql('three');
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
            model.text = 'loading';
            return new Promise(function (result) {
              setTimeout(function () {
                model.text = 'loaded';
                result();
              }, 100);
            });
          }
        }),
        h('span', model.text)
      );
    }

    attach(render, {});

    return click('button').then(function () {
      return retry(function () {
        expect(find('span').text()).to.eql('loading');
      });
    }).then(function () {
      return retry(function () {
        expect(find('span').text()).to.eql('loaded');
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

    describe('binding options', function () {
      it('can bind with set conversion', function () {
        var numberConversion = {
          value: function (text) {
            return Number(text);
          },

          text: function (value) {
            return String(value);
          }
        };

        function render(model) {
          return h('div',
            h('input', {type: 'text', binding: [model, 'number', numberConversion]}),
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

      it("doesn't set the input text if the value is an Error", function () {
        function number(value) {
          var n = Number(value);
          if (isNaN(n)) {
            return new Error('expected a number');
          } else {
            return n;
          }
        }

        function render(model) {
          return h('div',
            h('input', {type: 'text', binding: [model, 'number', number]}),
            h('span', model.number)
          );
        }

        var model = {number: 0};
        attach(render, model);

        find('input').sendkeys('{selectall}{backspace}abc');

        return retry(function() {
          expect(find('span').text()).to.equal('Error: expected a number');
          expect(find('input').val()).to.equal('abc');
          expect(model.number).to.be.instanceof(Error);
        }).then(function () {
          find('input').sendkeys('{selectall}{backspace}123');
        }).then(function () {
          return retry(function() {
            expect(find('span').text()).to.equal('123');
            expect(find('input').val()).to.equal('123');
            expect(model.number).to.equal(123);
          });
        });
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

    it('can expose long-running state for components', function () {
      var events = [];

      function render(model) {
        return h.component(
          {
            onbeforeadd: function () {
              this.counter = 2;
            }
          },
          function () {
            var self = this;

            return h('div',
              h('span.counter', this.counter),
              h('button.add', {onclick: function () { self.counter++; }}, 'add')
            );
          }
        );
      }

      attach(render, {counter: 0});

      return retry(function () {
        expect(find('span.counter').text()).to.equal('2');
      }).then(function () {
        return click('button.add');
      }).then(function () {
        return retry(function () {
          expect(find('span.counter').text()).to.equal('3');
        });
      }).then(function () {
        return click('button.add');
      }).then(function () {
        return retry(function () {
          expect(find('span.counter').text()).to.equal('4');
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

        return h('div',
          h.component(function (component) {
            return h('div',
              h('span.inner-counter', model.counter),
              h('button.add-inner', {onclick: function () { model.counter++; return component; }},  'add inner')
            );
          }),
          h('span.outer-counter', model.counter),
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
        });
      }).then(function () {
        return click('button.add-inner');
      }).then(function () {
        return retry(function () {
          expect(find('span.inner-counter').text()).to.equal('2');
          expect(find('span.outer-counter').text()).to.equal('0');
        });
      }).then(function () {
        return click('button.add-outer').then(function () {
          return retry(function () {
            expect(find('span.inner-counter').text()).to.equal('3');
            expect(find('span.outer-counter').text()).to.equal('3');
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

    it('can capture fields from each refresh', function () {
      var events = [];

      function render(model) {
        model.value++;
        var refresh = h.refresh;

        return h('div',
          h.component(
            {
              value: model.value,

              onadd: function (element) {
                var self = this;
                element.addEventListener('click', function () {
                  events.push(self.value);
                  refresh();
                });
              }
            },
            h('.button-' + model.value, 'click me')
          )
        );
      }

      attach(render, {value: 0});
      return click('.button-1').then(function () {
        expect(events).to.eql([1]);
      }).then(function () {
        return click('.button-2').then(function () {
          expect(events).to.eql([1, 2]);
        });
      });
    });

    it('can update the component only when the cacheKey changes', function () {
      var updates = 0;
      var componentRenders = 0;
      var renders = 0;

      function render() {
        renders++;
        return h.component(
          {
            cacheKey: model.cacheKey,
            onupdate: function () {
              updates++;
            }
          },
          function () {
            componentRenders++;
            return h('button', {onclick: function () {}}, 'refresh');
          }
        );
      }

      var model = {
        cacheKey: 1
      };

      attach(render, model);

      expect(renders).to.equal(1);
      expect(componentRenders).to.equal(1);
      expect(updates).to.equal(0);

      return click('button').then(function () {
        return retry(function () {
          expect(renders).to.equal(2);
          expect(componentRenders).to.equal(1);
          expect(updates).to.equal(0);
        });
      }).then(function () {
        model.cacheKey++;
        return click('button');
      }).then(function () {
        return retry(function () {
          expect(componentRenders).to.equal(2);
          expect(updates).to.equal(1);
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

    it('refreshes whole page if passed a non-component', function () {
      function render(model) {
        var refresh = h.refresh;

        return h('div',
          h('h1', model.text),
          h('button.refresh', {
            onclick: function () {
              setTimeout(function () {
                model.text = 'after timeout';
                refresh({});
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

  describe('h.binding', function () {
    var refreshCalled;

    beforeEach(function () {
      refreshCalled = false;
      h.currentRender = {
        refresh: function (component) {
          refreshCalled = true;
          componentRefreshed = component;
        },

        requestRender: function (fn) {
          fn();
        }
      };
    });

    function expectToRefresh(options, v) {
      var model = {};

      h.binding([model, 'field'], options).set('value');
      expect(refreshCalled).to.equal(v);
    }

    function expectPromiseToRefresh(options, before, after) {
      var model = {};

      h.binding({
        set: function () {
          return wait(10);
        }
      }, options).set('value');
      expect(refreshCalled).to.equal(before);
      refreshCalled = false;

      return wait(20).then(function () {
        expect(refreshCalled).to.equal(after);
      });
    }

    context('normal', function () {
      it('normally calls refresh', function () {
        expectToRefresh(undefined, true);
      });

      it('normally calls refresh, even after a promise', function () {
        return expectPromiseToRefresh(undefined, true, true);
      });
    });

    context('component: component', function () {
      it('calls refresh with the component', function () {
        var component = {
          canRefresh: true,
          refresh: function () {
            this.wasRefreshed = true;
          }
        }

        var model = {};
        h.binding([model, 'field'], {component: component}).set('value');

        expect(component.wasRefreshed).to.be.true;
      });
    });

    context('norefresh: true', function () {
      it('never calls refresh', function () {
        expectToRefresh({norefresh: true}, false);
      });

      it('never calls refresh, even after promise', function () {
        return expectPromiseToRefresh({norefresh: true}, false, false);
      });
    });

    context('refresh: false', function () {
      it('never calls refresh', function () {
        expectToRefresh({refresh: false}, false);
      });

      it('never calls refresh, even after promise', function () {
        return expectPromiseToRefresh({refresh: false}, false, false);
      });
    });

    context("refresh: 'promise'", function () {
      it('never calls refresh', function () {
        expectToRefresh({refresh: 'promise'}, false);
      });

      it("doesn't call refresh, but does after a promise", function () {
        return expectPromiseToRefresh({refresh: 'promise'}, false, true);
      });
    });
  });
});

function wait(n) {
  return new Promise(function (result) {
    setTimeout(result, n);
  });
}
