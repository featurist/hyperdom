var $ = require('jquery');
var plastiq = require('..');
var h = plastiq.html;
var bind = plastiq.bind;
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

  function click(selector) {
    return retry(function () {
      expect(find(selector).length).to.eql(1);
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

    describe('className', function () {
      it('accepts a string', function () {
        function render(model) {
          return h('div.one', {className: 'two three'});
        }

        attach(render, {});

        expect(find('div').attr('class')).to.eql('one two three');
      });

      it('accepts an array', function () {
        function render(model) {
          return h('div.one', {className: ['two', 'three']});
        }

        attach(render, {});

        expect(find('div').attr('class')).to.eql('one two three');
      });

      it('accepts an object', function () {
        function render(model) {
          return h('div.one', {className: {two: true, three: true, four: false}});
        }

        attach(render, {});

        expect(find('div').attr('class')).to.eql('one two three');
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
          h('input', {type: 'text', model: bind(model, 'text')}),
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

    it('can bind to a textarea', function () {
      function render(model) {
        return h('div',
          h('textarea', {model: bind(model, 'text')}),
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
          h('input', {type: 'checkbox', model: bind(model, 'check')}),
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
            model: bind(model, 'colour'),
            value: 'red'
          }),
          h('input.blue', {
            type: 'radio',
            name: 'colour',
            model: bind(model, 'colour'),
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
            {model: bind(model, 'colour')},
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
                  }, 100);
                }, 100);
              }, 100);
            }, 100);
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
