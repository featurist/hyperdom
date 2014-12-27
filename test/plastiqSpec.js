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

      plastiq.attach(div, render, {});

      expect(find('.haha').length).to.eql(1);
    });

    function itCanRenderA(type, value, expectedValue) {
      it('can render a ' + type, function () {
        function render(model) {
          return h('div.haha', value);
        }

        plastiq.attach(div, render, {});

        expect(find('.haha').text()).to.eql(expectedValue != undefined? expectedValue: String(value));
      });
    }

    itCanRenderA('number', 4);
    itCanRenderA('boolean', true);
    itCanRenderA('date', new Date());
    itCanRenderA('undefined', undefined, '');
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

    plastiq.attach(div, render, {});

    return click('button').then(function () {
      expect(find('span').text()).to.eql('on');
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

    plastiq.attach(div, render, {});

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

      plastiq.attach(div, render, {text: ''});

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

      plastiq.attach(div, render, {text: ''});

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

      plastiq.attach(div, render, {check: false});

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
            value: { name: 'blue' }
          }),
          h('span', JSON.stringify(model.colour))
        );
      }

      plastiq.attach(div, render, {colour: undefined});

      return retry(function() {
        expect(find('span').text()).to.equal('');
        expect(find('input.red').prop('checked')).to.equal(false);
        expect(find('input.blue').prop('checked')).to.equal(false);
      }).then(function () {
        find('input.red').click();

        return retry(function() {
          expect(find('span').text()).to.equal('"red"');
          expect(find('input.red').prop('checked')).to.equal(true);
        });
      });
    });
  });

  describe('animations', function () {
    it('can render several frames of an animation', function () {
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

      plastiq.attach(div, render, {});

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
